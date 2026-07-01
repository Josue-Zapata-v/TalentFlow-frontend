"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { postulacionesService } from "../services/postulacionesService";

type Status = "idle" | "submitting" | "success" | "already" | "error";

export function PostularButton({ vacanteId }: { vacanteId: string }) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Link href="/login">
        <Button>Inicia sesión para postularte</Button>
      </Link>
    );
  }

  if (user?.rol !== "POSTULANTE") {
    return (
      <p className="text-sm text-muted-foreground">
        Solo los usuarios con rol de postulante pueden aplicar a esta vacante.
      </p>
    );
  }

  if (status === "success" || status === "already") {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-estado-oferta">
          {status === "success" ? "¡Postulación enviada correctamente!" : "Ya postulaste a esta vacante."}
        </p>
        <Link href="/postulante" className="text-sm font-medium text-primary hover:underline">
          Ver mis postulaciones
        </Link>
      </div>
    );
  }

  async function handleClick() {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      await postulacionesService.apply(vacanteId);
      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError && err.code === "CONFLICT") {
        setStatus("already");
      } else {
        setStatus("error");
        setErrorMessage(err instanceof ApiError ? err.message : "No se pudo enviar tu postulación.");
      }
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleClick} disabled={status === "submitting"}>
        {status === "submitting" ? "Enviando..." : "Postularme a esta vacante"}
      </Button>
      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
