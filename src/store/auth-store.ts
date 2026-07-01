import { create } from "zustand";
import { PublicUser } from "@/types/shared";

const ROLE_COOKIE_NAME = "tf_role";

// Cookie liviana, NO-httpOnly, sin datos sensibles (solo el rol) — existe
// únicamente para que middleware.ts decida qué UI mostrar (UX, no seguridad
// real; ver CLAUDE.md sección 3bis). El JWT nunca vive en una cookie propia.
function setRoleCookie(rol: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE_NAME}=${rol}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearRoleCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${ROLE_COOKIE_NAME}=; path=/; max-age=0`;
}

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  isHydrating: boolean;
  setSession: (user: PublicUser, accessToken: string) => void;
  clearSession: () => void;
  setHydrating: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isHydrating: true,
  setSession: (user, accessToken) => {
    setRoleCookie(user.rol);
    set({ user, accessToken });
  },
  clearSession: () => {
    clearRoleCookie();
    set({ user: null, accessToken: null });
  },
  setHydrating: (value) => set({ isHydrating: value }),
}));
