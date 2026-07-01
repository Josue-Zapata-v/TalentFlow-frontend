import { Badge } from "@/components/ui/badge";
import { EstadoVacante } from "@/types/shared";

const label: Record<EstadoVacante, string> = {
  ABIERTA: "Abierta",
  CERRADA: "Cerrada",
  BORRADOR: "Borrador",
};

const variant: Record<EstadoVacante, "default" | "secondary" | "outline"> = {
  ABIERTA: "default",
  CERRADA: "outline",
  BORRADOR: "secondary",
};

export function EstadoVacanteBadge({ estado }: { estado: EstadoVacante }) {
  return <Badge variant={variant[estado]}>{label[estado]}</Badge>;
}
