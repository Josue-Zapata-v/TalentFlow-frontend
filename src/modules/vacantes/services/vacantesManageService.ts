import { apiClient } from "@/lib/api-client";
import { Vacante } from "@/types/shared";
import { ManageVacantesFilters, VacantesListResult, VacanteFormValues } from "../types";

function buildQueryString(filters: ManageVacantesFilters): string {
  const params = new URLSearchParams();
  if (filters.ubicacion) params.set("ubicacion", filters.ubicacion);
  if (filters.modalidad) params.set("modalidad", filters.modalidad);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const vacantesManageService = {
  listMine: (filters: ManageVacantesFilters = {}) =>
    apiClient.get<VacantesListResult>(`/vacantes/manage/list${buildQueryString(filters)}`),

  getById: (id: string) => apiClient.get<{ vacante: Vacante }>(`/vacantes/manage/${id}`),

  create: (input: VacanteFormValues) => apiClient.post<{ vacante: Vacante }>("/vacantes", input),

  update: (id: string, input: Partial<VacanteFormValues>) =>
    apiClient.patch<{ vacante: Vacante }>(`/vacantes/manage/${id}`, input),

  remove: (id: string) => apiClient.delete<null>(`/vacantes/manage/${id}`),
};
