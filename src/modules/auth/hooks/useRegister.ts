"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "../services/authService";
import { RegisterFormValues, registerSchema, roleHomeRoute } from "../types";

export function useRegister() {
  const [serverError, setServerError] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nombre: "", email: "", password: "", rol: "POSTULANTE" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await authService.register(values);
      setSession(result.user, result.accessToken);
      router.push(roleHomeRoute[result.user.rol]);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "No se pudo completar el registro. Intenta de nuevo.");
    }
  });

  return { form, onSubmit, serverError, isSubmitting: form.formState.isSubmitting };
}
