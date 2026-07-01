"use client";

import { useAuthStore } from "@/store/auth-store";
import { authService } from "../services/authService";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const clearSession = useAuthStore((s) => s.clearSession);

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
    }
  };

  return {
    user,
    isAuthenticated: Boolean(accessToken && user),
    isHydrating,
    logout,
  };
}
