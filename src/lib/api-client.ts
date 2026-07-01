import { useAuthStore } from "@/store/auth-store";
import { ApiResponse, AuthResult } from "@/types/shared";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** No adjuntar el header Authorization (login/registro, donde aún no hay token). */
  skipAuth?: boolean;
  /** Evita el reintento tras un 401 (usado internamente al refrescar, para no recursar). */
  skipRetry?: boolean;
}

async function rawFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, skipRetry, headers, credentials, ...rest } = options;
  const accessToken = useAuthStore.getState().accessToken;

  // Las rutas de auth necesitan credentials:'include' para que el navegador
  // acepte/envíe la cookie httpOnly del refresh token, cross-domain (Vercel/Render).
  const defaultCredentials: RequestCredentials = path.startsWith("/auth/") ? "include" : "same-origin";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: credentials ?? defaultCredentials,
    headers: {
      "Content-Type": "application/json",
      ...(!skipAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    if (res.status === 401 && !skipAuth && !skipRetry) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return rawFetch<T>(path, { ...options, skipRetry: true });
      }
      useAuthStore.getState().clearSession();
    }
    throw new ApiError(json.error.code, json.error.message, res.status);
  }

  return json.data;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const result = await rawFetch<AuthResult>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
      skipRetry: true,
    });
    useAuthStore.getState().setSession(result.user, result.accessToken);
    return true;
  } catch {
    return false;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) => rawFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    rawFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    rawFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) => rawFetch<T>(path, { ...options, method: "DELETE" }),
};

/** Exportado para el arranque de la app (rehidratación silenciosa al cargar). */
export { tryRefresh };
