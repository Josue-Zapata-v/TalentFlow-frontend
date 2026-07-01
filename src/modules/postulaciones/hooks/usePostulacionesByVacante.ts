"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { Postulacion } from "@/types/shared";
import { postulacionesService } from "../services/postulacionesService";

export function usePostulacionesByVacante(vacanteId: string, enabled: boolean) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    postulacionesService
      .getByVacante(vacanteId)
      .then((result) => setPostulaciones(result.postulaciones))
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "No se pudieron cargar las postulaciones.");
      })
      .finally(() => setIsLoading(false));
  }, [enabled, vacanteId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { postulaciones, isLoading, error, refetch };
}
