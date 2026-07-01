import { apiClient } from "@/lib/api-client";
import { AuthResult, Rol } from "@/types/shared";

export interface RegisterInput {
  nombre: string;
  email: string;
  password: string;
  rol: Extract<Rol, "RECLUTADOR" | "POSTULANTE">;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  register: (input: RegisterInput) => apiClient.post<AuthResult>("/auth/register", input, { skipAuth: true }),
  login: (input: LoginInput) => apiClient.post<AuthResult>("/auth/login", input, { skipAuth: true }),
  logout: () => apiClient.post<null>("/auth/logout"),
};
