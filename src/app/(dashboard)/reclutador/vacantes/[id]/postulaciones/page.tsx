"use client";

import { useParams } from "next/navigation";
import { LoadingState } from "@/components/ui/loading-state";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { KanbanBoard } from "@/modules/postulaciones/components/KanbanBoard";
import { usePostulacionesByVacante } from "@/modules/postulaciones/hooks/usePostulacionesByVacante";

export default function PostulacionesVacantePage() {
  const { isReady } = useRequireRole("RECLUTADOR");
  const params = useParams<{ id: string }>();
  const { postulaciones, isLoading, error, refetch } = usePostulacionesByVacante(params.id, isReady);

  if (!isReady) {
    return null;
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Postulaciones</h1>
      <p className="mt-2 text-base text-muted-foreground">
        Cambia el estado de cada postulante seleccionando la nueva etapa.
      </p>

      {isLoading && <LoadingState />}

      {error && (
        <p role="alert" className="mt-12 text-center text-destructive">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="mt-8">
          <KanbanBoard postulaciones={postulaciones} onChanged={refetch} />
        </div>
      )}
    </main>
  );
}
