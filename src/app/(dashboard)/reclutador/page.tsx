"use client";

import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { formatDate } from "@/lib/utils";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { EstadoVacanteBadge } from "@/modules/vacantes/components/EstadoVacanteBadge";
import { useMisVacantes } from "@/modules/vacantes/hooks/useMisVacantes";
import { vacantesManageService } from "@/modules/vacantes/services/vacantesManageService";

export default function ReclutadorPage() {
  const { isReady } = useRequireRole("RECLUTADOR");
  const { vacantes, isLoading, error, refetch } = useMisVacantes(isReady);

  if (!isReady) {
    return null;
  }

  async function handleDelete(id: string, titulo: string) {
    if (!window.confirm(`¿Eliminar la vacante "${titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await vacantesManageService.remove(id);
      refetch();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar la vacante.");
    }
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) px-6 py-12">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Mis vacantes</h1>
          <p className="mt-2 text-base text-muted-foreground">Gestiona tus vacantes publicadas.</p>
        </div>
        <Link href="/reclutador/vacantes/nueva">
          <Button>Crear vacante</Button>
        </Link>
      </div>

      {isLoading && <LoadingState />}

      {error && (
        <p role="alert" className="mt-12 text-center text-destructive">
          {error}
        </p>
      )}

      {!isLoading && !error && vacantes.length === 0 && (
        <EmptyState
          icon={Briefcase}
          title="Aún no has creado ninguna vacante"
          description="Crea tu primera vacante para empezar a recibir postulaciones."
        />
      )}

      {!isLoading && !error && vacantes.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {vacantes.map((vacante) => (
            <div
              key={vacante.id}
              className="flex flex-col gap-4 rounded-md border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-lg font-bold text-foreground">{vacante.titulo}</h2>
                  <EstadoVacanteBadge estado={vacante.estado} />
                </div>
                <p className="text-sm text-muted-foreground">{vacante.ubicacion}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  Creada el {formatDate(vacante.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/reclutador/vacantes/${vacante.id}/postulaciones`}>
                  <Button variant="outline">Postulaciones</Button>
                </Link>
                <Link href={`/reclutador/vacantes/${vacante.id}/editar`}>
                  <Button variant="outline">Editar</Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(vacante.id, vacante.titulo)}>
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
