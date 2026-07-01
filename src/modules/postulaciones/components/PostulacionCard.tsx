import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Postulacion } from "@/types/shared";
import { EstadoTimeline } from "./EstadoTimeline";

export function PostulacionCard({ postulacion }: { postulacion: Postulacion }) {
  return (
    <div className="flex flex-col gap-5 rounded-md border border-border bg-card p-5">
      <div>
        <Link
          href={`/vacantes/${postulacion.vacante.slug}`}
          className="font-heading text-lg font-bold text-foreground hover:text-primary"
        >
          {postulacion.vacante.titulo}
        </Link>
        <p className="font-mono text-xs text-muted-foreground">
          Postulado el {formatDate(postulacion.createdAt)}
        </p>
      </div>

      <EstadoTimeline estado={postulacion.estado} />
    </div>
  );
}
