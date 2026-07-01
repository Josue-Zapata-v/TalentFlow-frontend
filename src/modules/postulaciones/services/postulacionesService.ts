import { apiClient } from "@/lib/api-client";
import { EstadoPostulacion, Postulacion } from "@/types/shared";

export const postulacionesService = {
  getMisPostulaciones: () => apiClient.get<{ postulaciones: Postulacion[] }>("/postulaciones/mias"),

  apply: (vacanteId: string, observaciones?: string) =>
    apiClient.post<{ postulacion: Postulacion }>("/postulaciones", { vacanteId, observaciones }),

  getByVacante: (vacanteId: string) =>
    apiClient.get<{ postulaciones: Postulacion[] }>(`/postulaciones/vacante/${vacanteId}`),

  changeEstado: (id: string, estado: EstadoPostulacion) =>
    apiClient.patch<{ postulacion: Postulacion }>(`/postulaciones/${id}/estado`, { estado }),
};
