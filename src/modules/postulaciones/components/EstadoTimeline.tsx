import { cn } from "@/lib/utils";
import { EstadoPostulacion } from "@/types/shared";

const ETAPAS: { estado: EstadoPostulacion; label: string }[] = [
  { estado: "POSTULADO", label: "Postulado" },
  { estado: "EN_REVISION", label: "En revisión" },
  { estado: "ENTREVISTA", label: "Entrevista" },
  { estado: "OFERTA", label: "Oferta" },
  { estado: "CONTRATADO", label: "Contratado" },
];

const bgClass: Record<EstadoPostulacion, string> = {
  POSTULADO: "bg-estado-postulado",
  EN_REVISION: "bg-estado-revision",
  ENTREVISTA: "bg-estado-entrevista",
  OFERTA: "bg-estado-oferta",
  CONTRATADO: "bg-estado-contratado",
  RECHAZADO: "bg-estado-rechazado",
};

export function EstadoTimeline({ estado }: { estado: EstadoPostulacion }) {
  if (estado === "RECHAZADO") {
    return (
      <div className="flex items-center gap-2">
        <span aria-hidden className="size-3 rounded-full bg-estado-rechazado" />
        <span className="text-sm font-medium text-estado-rechazado">Rechazado</span>
      </div>
    );
  }

  const currentIndex = ETAPAS.findIndex((etapa) => etapa.estado === estado);

  return (
    <ol aria-label="Progreso de la postulación" className="flex items-start">
      {ETAPAS.map((etapa, index) => {
        const isReached = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={etapa.estado} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-hidden
                className={cn(
                  "size-3.5 shrink-0 rounded-full",
                  isReached ? bgClass[etapa.estado] : "border-2 border-border bg-background",
                  isCurrent && "ring-2 ring-offset-2 ring-primary/40",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[0.65rem] whitespace-nowrap",
                  isReached ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {etapa.label}
              </span>
            </div>
            {index < ETAPAS.length - 1 && <div className="mx-1 mt-[7px] h-px flex-1 self-start bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}
