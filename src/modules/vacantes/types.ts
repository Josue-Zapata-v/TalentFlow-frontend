import { ModalidadVacante, Pagination, Vacante } from "@/types/shared";

export interface VacantesFilters {
  ubicacion?: string;
  modalidad?: ModalidadVacante;
  categoria?: string;
  page?: number;
  limit?: number;
}

export interface VacantesListResult {
  vacantes: Vacante[];
  pagination: Pagination;
}
