"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Rol } from "@/types/shared";
import { useAuth } from "./useAuth";

/**
 * Guard de UX para paginas de dashboard (Client Components). Redirige a
 * /login si no hay sesion o el rol no coincide, una vez termina la
 * rehidratacion silenciosa. No reemplaza la autorizacion del backend.
 */
export function useRequireRole(role: Rol) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated || (user && user.rol !== role)) {
      router.replace("/login");
    }
  }, [isHydrating, isAuthenticated, user, role, router]);

  return { user, isReady: !isHydrating && isAuthenticated && user?.rol === role };
}
