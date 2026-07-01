import { apiClient } from "@/lib/api-client";
import { Postulacion } from "@/types/shared";

export const postulacionesService = {
  getMisPostulaciones: () => apiClient.get<{ postulaciones: Postulacion[] }>("/postulaciones/mias"),
};
