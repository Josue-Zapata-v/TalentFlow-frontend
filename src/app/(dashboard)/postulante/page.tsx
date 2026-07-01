"use client";

import Link from "next/link";
import { useRequireRole } from "@/modules/auth/hooks/useRequireRole";
import { PostulacionCard } from "@/modules/postulaciones/components/PostulacionCard";
import { useMisPostulaciones } from "@/modules/postulaciones/hooks/useMisPostulaciones";

export default function PostulantePage() {
  const { isReady } = useRequireRole("POSTULANTE");
  const { postulaciones, isLoading, error } = useMisPostulaciones(isReady);

  if (!isReady) {
    return null;
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Mis postulaciones</h1>
      <p className="mt-2 text-base text-muted-foreground">
        Sigue el estado de tus postulaciones a las vacantes de TalentFlow.
      </p>

      {isLoading && <p className="mt-12 text-center text-muted-foreground">Cargando...</p>}

      {error && (
        <p role="alert" className="mt-12 text-center text-destructive">
          {error}
        </p>
      )}

      {!isLoading && !error && postulaciones.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">
          Aún no tienes postulaciones.{" "}
          <Link href="/vacantes" className="font-medium text-primary hover:underline">
            Explora las vacantes disponibles
          </Link>
          .
        </p>
      )}

      {!isLoading && !error && postulaciones.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {postulaciones.map((postulacion) => (
            <PostulacionCard key={postulacion.id} postulacion={postulacion} />
          ))}
        </div>
      )}
    </main>
  );
}
