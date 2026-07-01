import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
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
          <p className="text-base text-muted-foreground">{vacante.ubicacion}</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-muted-foreground">
              Publicada el {formatDate(vacante.createdAt)}
            </span>
            {vacante.salarioRango && (
              <span className="font-mono text-xs font-medium text-foreground">{vacante.salarioRango}</span>
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
          <Link href="/login">
            <Button>Postularme a esta vacante</Button>
          </Link>
        </div>
      </article>
    </main>
  );
}
