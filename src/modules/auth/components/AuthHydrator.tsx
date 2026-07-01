"use client";

import { useEffect } from "react";
import { tryRefresh } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

/**
 * El access token vive solo en memoria (Zustand), así que un F5 lo pierde.
 * Al montar la app, intenta regenerarlo silenciosamente usando la cookie
 * httpOnly del refresh token (ver CLAUDE.md sección 3bis).
 */
export function AuthHydrator() {
  const setHydrating = useAuthStore((s) => s.setHydrating);

  useEffect(() => {
    tryRefresh().finally(() => setHydrating(false));
  }, [setHydrating]);

  return null;
}
