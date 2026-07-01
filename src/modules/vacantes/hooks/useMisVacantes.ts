"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { Vacante } from "@/types/shared";
import { vacantesManageService } from "../services/vacantesManageService";

export function useMisVacantes(enabled: boolean) {
  const [vacantes, setVacantes] = useState<Vacante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    vacantesManageService
      .listMine({ limit: 50 })
      .then((result) => setVacantes(result.vacantes))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "No se pudieron cargar tus vacantes.");
      })
      .finally(() => setIsLoading(false));
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { vacantes, isLoading, error, refetch };
}
