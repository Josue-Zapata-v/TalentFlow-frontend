"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { authService } from "../services/authService";
import { LoginFormValues, loginSchema, roleHomeRoute } from "../types";

export function useLogin() {
  const [serverError, setServerError] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      const result = await authService.login(values);
      setSession(result.user, result.accessToken);
      router.push(roleHomeRoute[result.user.rol]);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión. Intenta de nuevo.");
    }
  });

  return { form, onSubmit, serverError, isSubmitting: form.formState.isSubmitting };
}
