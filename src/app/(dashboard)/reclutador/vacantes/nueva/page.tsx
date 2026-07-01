"use client";

import { useRouter } from "next/navigation";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { VacanteForm } from "@/modules/vacantes/components/VacanteForm";
import { vacantesManageService } from "@/modules/vacantes/services/vacantesManageService";
import { VacanteFormValues } from "@/modules/vacantes/types";

export default function NuevaVacantePage() {
  const { isReady } = useRequireRole("RECLUTADOR");
  const router = useRouter();

  if (!isReady) {
    return null;
  }

  async function handleSubmit(values: VacanteFormValues) {
    await vacantesManageService.create(values);
    router.push("/reclutador");
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-md) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Crear vacante</h1>
      <p className="mt-2 text-base text-muted-foreground">Completa los datos de la nueva vacante.</p>
      <div className="mt-8">
        <VacanteForm onSubmit={handleSubmit} submitLabel="Crear vacante" />
      </div>
    </main>
  );
}
