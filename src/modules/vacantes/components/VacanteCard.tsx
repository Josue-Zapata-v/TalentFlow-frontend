import { CalendarDays, MapPin, Tag, Wallet } from "lucide-react";
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
        <h2 className="font-heading text-lg font-bold text-foreground group-hover:text-primary">
          {vacante.titulo}
        </h2>
        <ModalidadBadge modalidad={vacante.modalidad} />
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4 shrink-0" aria-hidden />
        {vacante.ubicacion}
      </p>

      {vacante.categoria && (
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Tag className="size-4 shrink-0" aria-hidden />
          {vacante.categoria}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden />
          {formatDate(vacante.createdAt)}
        </span>
        {vacante.salarioRango && (
          <span className="flex items-center gap-1.5 font-mono text-xs font-medium text-foreground">
            <Wallet className="size-3.5 shrink-0" aria-hidden />
            {vacante.salarioRango}
          </span>
        )}
      </div>
    </Link>
  );
}
