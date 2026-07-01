import { z } from "zod";
import { Rol } from "@/types/shared";

export const roleHomeRoute: Record<Rol, string> = {
  ADMIN: "/admin",
  RECLUTADOR: "/reclutador",
  POSTULANTE: "/postulante",
};

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ADMIN excluido a propósito: el registro público nunca puede auto-asignar ese rol
// (mismo criterio que el backend, ver auth.dto.ts).
export const registerSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(["RECLUTADOR", "POSTULANTE"]),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
