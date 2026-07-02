"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { ApiError } from "@/lib/api-client";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { VacanteForm } from "@/modules/vacantes/components/VacanteForm";
import { vacantesManageService } from "@/modules/vacantes/services/vacantesManageService";
import { VacanteFormValues } from "@/modules/vacantes/types";

export default function EditarVacantePage() {
  const { isReady } = useRequireRole("RECLUTADOR");
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<VacanteFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;

    vacantesManageService
      .getById(params.id)
      .then((result) => {
        const { titulo, descripcion, requisitos, ubicacion, modalidad, salarioRango, categoria, estado } =
          result.vacante;
        setDefaultValues({
          titulo,
          descripcion,
          requisitos,
          ubicacion,
          modalidad,
          salarioRango: salarioRango ?? "",
          categoria: categoria ?? "",
          estado,
        });
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "No se pudo cargar la vacante.");
      });
  }, [isReady, params.id]);

  if (!isReady) {
    return null;
  }

  async function handleSubmit(values: VacanteFormValues) {
    await vacantesManageService.update(params.id, values);
    router.push("/reclutador");
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-md) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Editar vacante</h1>

      {error && (
        <p role="alert" className="mt-8 text-destructive">
          {error}
        </p>
      )}

      {!error && !defaultValues && <LoadingState />}

      {defaultValues && (
        <div className="mt-8">
          <VacanteForm defaultValues={defaultValues} onSubmit={handleSubmit} submitLabel="Guardar cambios" />
        </div>
      )}
    </main>
  );
}
