"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { Postulacion } from "@/types/shared";
import { postulacionesService } from "../services/postulacionesService";

// "enabled" evita disparar el fetch antes de que termine la rehidratacion de
// sesion: si se llama con el access token aun sin listo, api-client dispara
// un 401 -> refresh -> reintento innecesario, sumando latencia de mas.
export function useMisPostulaciones(enabled: boolean) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let active = true;
    setIsLoading(true);

    postulacionesService
      .getMisPostulaciones()
      .then((result) => {
        if (active) setPostulaciones(result.postulaciones);
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar tus postulaciones.");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  return { postulaciones, isLoading, error };
}
