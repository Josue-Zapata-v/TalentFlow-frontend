"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { PublicUser, Rol } from "@/types/shared";
import { usersService } from "../services/usersService";

export function useUsers(enabled: boolean, rol?: Rol) {
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    usersService
      .list({ rol, limit: 50 })
      .then((result) => setUsers(result.users))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "No se pudieron cargar los usuarios.");
      })
      .finally(() => setIsLoading(false));
  }, [enabled, rol]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { users, isLoading, error, refetch };
}
