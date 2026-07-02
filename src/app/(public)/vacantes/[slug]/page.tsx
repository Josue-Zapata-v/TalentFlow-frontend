import { CalendarDays, MapPin, Wallet } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { PostularButton } from "@/modules/postulaciones/components/PostularButton";
import { ModalidadBadge } from "@/modules/vacantes/components/ModalidadBadge";
import { getPublicVacanteBySlug } from "@/modules/vacantes/services/vacantesService";

interface VacanteDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: VacanteDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const vacante = await getPublicVacanteBySlug(slug);

  if (!vacante) {
    return { title: "Vacante no encontrada | TalentFlow" };
  }

  const description = vacante.descripcion.slice(0, 160);

  return {
    title: `${vacante.titulo} | TalentFlow`,
    description,
    openGraph: {
      title: vacante.titulo,
      description,
      type: "article",
    },
  };
}

export default async function VacanteDetailPage({ params }: VacanteDetailPageProps) {
  const { slug } = await params;
  const vacante = await getPublicVacanteBySlug(slug);

  if (!vacante) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-(--breakpoint-md) px-6 py-12">
      <article>
        <header className="flex flex-col gap-3 border-b border-border pb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-heading text-3xl font-bold text-foreground">{vacante.titulo}</h1>
            <ModalidadBadge modalidad={vacante.modalidad} />
          </div>
          <p className="flex items-center gap-1.5 text-base text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {vacante.ubicacion}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" aria-hidden />
              Publicada el {formatDate(vacante.createdAt)}
            </span>
            {vacante.salarioRango && (
              <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
                <Wallet className="size-3.5 shrink-0" aria-hidden />
                {vacante.salarioRango}
              </span>
            )}
          </div>
        </header>

        <section className="mt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Descripción</h2>
          <p className="mt-2 whitespace-pre-line text-base text-foreground">{vacante.descripcion}</p>
        </section>

        <section className="mt-6">
          <h2 className="font-heading text-xl font-bold text-foreground">Requisitos</h2>
          <p className="mt-2 whitespace-pre-line text-base text-foreground">{vacante.requisitos}</p>
        </section>

        <div className="mt-8">
          <PostularButton vacanteId={vacante.id} />
        </div>
      </article>
    </main>
  );
}
