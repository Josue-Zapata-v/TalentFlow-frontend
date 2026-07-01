// Espeja exactamente el formato de respuesta y los DTOs del backend
// (ver CLAUDE.md del backend, secciones 5 y 10). Cualquier cambio en el
// backend que rompa este contrato debe reflejarse aquí primero.

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export type Rol = "ADMIN" | "RECLUTADOR" | "POSTULANTE";
export type ModalidadVacante = "REMOTO" | "PRESENCIAL" | "HIBRIDO";
export type EstadoVacante = "ABIERTA" | "CERRADA" | "BORRADOR";
export type EstadoPostulacion =
  | "POSTULADO"
  | "EN_REVISION"
  | "ENTREVISTA"
  | "OFERTA"
  | "RECHAZADO"
  | "CONTRATADO";

export interface PublicUser {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  createdAt: string;
}

export interface Vacante {
  id: string;
  titulo: string;
  slug: string;
  descripcion: string;
  requisitos: string;
  ubicacion: string;
  modalidad: ModalidadVacante;
  salarioRango: string | null;
  categoria: string | null;
  estado: EstadoVacante;
  reclutadorId: string;
  createdAt: string;
}

export interface PostulacionVacanteRef {
  id: string;
  titulo: string;
  slug: string;
  estado: EstadoVacante;
  reclutadorId: string;
}

export interface PostulacionPostulanteRef {
  id: string;
  nombre: string;
  email: string;
}

export interface Postulacion {
  id: string;
  vacanteId: string;
  postulanteId: string;
  cvUrl: string | null;
  observaciones: string | null;
  estado: EstadoPostulacion;
  createdAt: string;
  updatedAt: string;
  vacante: PostulacionVacanteRef;
  postulante: PostulacionPostulanteRef;
}

export interface HistorialEstado {
  id: string;
  postulacionId: string;
  estadoAnterior: EstadoPostulacion | null;
  estadoNuevo: EstadoPostulacion;
  cambiadoPorId: string;
  fecha: string;
  cambiadoPor: {
    id: string;
    nombre: string;
    email: string;
    rol: Rol;
  };
}

export interface AuthResult {
  user: PublicUser;
  accessToken: string;
}
