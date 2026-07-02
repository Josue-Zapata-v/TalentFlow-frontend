import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EmptyState } from "@/components/ui/empty-state";
import { getPublicVacantes } from "@/modules/vacantes/services/vacantesService";
import { VacanteCard } from "@/modules/vacantes/components/VacanteCard";
import { VacanteFilterBar } from "@/modules/vacantes/components/VacanteFilterBar";
import { ModalidadVacante } from "@/types/shared";

export const metadata: Metadata = {
  title: "Vacantes | TalentFlow",
  description: "Explora las vacantes abiertas en TalentFlow: filtra por ubicación, modalidad y categoría.",
};

interface VacantesPageProps {
  searchParams: Promise<{
    ubicacion?: string;
    modalidad?: string;
    categoria?: string;
    page?: string;
  }>;
}

export default async function VacantesPage({ searchParams }: VacantesPageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;

  const { vacantes, pagination } = await getPublicVacantes({
    ubicacion: params.ubicacion,
    modalidad: params.modalidad as ModalidadVacante | undefined,
    categoria: params.categoria,
    page,
  });

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  function pageHref(targetPage: number) {
    const next = new URLSearchParams();
    if (params.ubicacion) next.set("ubicacion", params.ubicacion);
    if (params.modalidad) next.set("modalidad", params.modalidad);
    if (params.categoria) next.set("categoria", params.categoria);
    next.set("page", String(targetPage));
    return `/vacantes?${next.toString()}`;
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-xl) px-6 py-12">
      <h1 className="font-heading text-3xl font-bold text-foreground">Vacantes disponibles</h1>
      <p className="mt-2 text-base text-muted-foreground">
        {pagination.total} {pagination.total === 1 ? "vacante encontrada" : "vacantes encontradas"}
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <VacanteFilterBar />
        </Suspense>
      </div>

      {vacantes.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No se encontraron vacantes con esos filtros"
          description="Intenta ajustar la búsqueda o quitar algún filtro."
        />
      ) : (
        <section
          aria-label="Listado de vacantes"
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {vacantes.map((vacante) => (
            <VacanteCard key={vacante.id} vacante={vacante} />
          ))}
        </section>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginación" className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page <= 1}
            className={`text-sm font-medium ${page <= 1 ? "pointer-events-none text-muted-foreground/50" : "text-primary hover:underline"}`}
          >
            Anterior
          </Link>
          <span className="font-mono text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Link
            href={pageHref(Math.min(totalPages, page + 1))}
            aria-disabled={page >= totalPages}
            className={`text-sm font-medium ${page >= totalPages ? "pointer-events-none text-muted-foreground/50" : "text-primary hover:underline"}`}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </main>
  );
}
