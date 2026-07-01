import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Vacante } from "@/types/shared";
import { ModalidadBadge } from "./ModalidadBadge";

export function VacanteCard({ vacante }: { vacante: Vacante }) {
  return (
    <Link
      href={`/vacantes/${vacante.slug}`}
      className="group flex flex-col gap-3 rounded-md border border-border bg-card p-5 shadow-sm transition-all hover:border-primary hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary">
          {vacante.titulo}
        </h3>
        <ModalidadBadge modalidad={vacante.modalidad} />
      </div>

      <p className="text-sm text-muted-foreground">{vacante.ubicacion}</p>

      {vacante.categoria && (
        <p className="text-sm text-muted-foreground">{vacante.categoria}</p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="font-mono text-xs text-muted-foreground">{formatDate(vacante.createdAt)}</span>
        {vacante.salarioRango && (
          <span className="font-mono text-xs font-medium text-foreground">{vacante.salarioRango}</span>
        )}
      </div>
    </Link>
  );
}
