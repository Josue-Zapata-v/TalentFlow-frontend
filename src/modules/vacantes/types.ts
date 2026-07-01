import { z } from "zod";
import { EstadoVacante, ModalidadVacante, Pagination, Vacante } from "@/types/shared";

export interface VacantesFilters {
  ubicacion?: string;
  modalidad?: ModalidadVacante;
  categoria?: string;
  page?: number;
  limit?: number;
}

export interface ManageVacantesFilters extends VacantesFilters {
  estado?: EstadoVacante;
}

export interface VacantesListResult {
  vacantes: Vacante[];
  pagination: Pagination;
}

// Mismos criterios de validación que el backend (vacantes.dto.ts).
export const vacanteFormSchema = z.object({
  titulo: z.string().trim().min(5, "El título debe tener al menos 5 caracteres"),
  descripcion: z.string().trim().min(20, "La descripción debe tener al menos 20 caracteres"),
  requisitos: z.string().trim().min(10, "Los requisitos deben tener al menos 10 caracteres"),
  ubicacion: z.string().trim().min(2, "La ubicación es obligatoria"),
  modalidad: z.enum(["REMOTO", "PRESENCIAL", "HIBRIDO"]),
  salarioRango: z.string().trim().optional(),
  categoria: z.string().trim().optional(),
  estado: z.enum(["ABIERTA", "CERRADA", "BORRADOR"]),
});

export type VacanteFormValues = z.infer<typeof vacanteFormSchema>;
