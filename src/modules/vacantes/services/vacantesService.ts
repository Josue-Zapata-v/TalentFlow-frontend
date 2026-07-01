import { ApiResponse, Vacante } from "@/types/shared";
import { VacantesFilters, VacantesListResult } from "../types";

// Servicio "server-safe": solo fetch nativo, sin lib/api-client (que depende
// del store de Zustand, exclusivo del navegador). Los endpoints públicos de
// vacantes no requieren auth y se llaman desde Server Components para SSR/ISR
// real (ver CLAUDE.md sección 3bis sobre por qué el token no puede vivir aquí).
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

function buildQueryString(filters: VacantesFilters): string {
  const params = new URLSearchParams();
  if (filters.ubicacion) params.set("ubicacion", filters.ubicacion);
  if (filters.modalidad) params.set("modalidad", filters.modalidad);
  if (filters.categoria) params.set("categoria", filters.categoria);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getPublicVacantes(filters: VacantesFilters = {}): Promise<VacantesListResult> {
  const res = await fetch(`${API_BASE_URL}/vacantes${buildQueryString(filters)}`, {
    next: { revalidate: 60 },
  });
  const json = (await res.json()) as ApiResponse<VacantesListResult>;

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export async function getPublicVacanteBySlug(slug: string): Promise<Vacante | null> {
  const res = await fetch(`${API_BASE_URL}/vacantes/${slug}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    return null;
  }

  const json = (await res.json()) as ApiResponse<{ vacante: Vacante }>;

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data.vacante;
}
