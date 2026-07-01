import { Badge } from "@/components/ui/badge";
import { Rol } from "@/types/shared";

const label: Record<Rol, string> = {
  ADMIN: "Admin",
  RECLUTADOR: "Reclutador",
  POSTULANTE: "Postulante",
};

const variant: Record<Rol, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  RECLUTADOR: "secondary",
  POSTULANTE: "outline",
};

export function RolBadge({ rol }: { rol: Rol }) {
  return <Badge variant={variant[rol]}>{label[rol]}</Badge>;
}
