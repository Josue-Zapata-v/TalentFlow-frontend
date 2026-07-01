import { Badge } from "@/components/ui/badge";
import { ModalidadVacante } from "@/types/shared";

const modalidadLabel: Record<ModalidadVacante, string> = {
  REMOTO: "Remoto",
  PRESENCIAL: "Presencial",
  HIBRIDO: "Híbrido",
};

export function ModalidadBadge({ modalidad }: { modalidad: ModalidadVacante }) {
  return (
    <Badge variant="outline" className="font-sans">
      {modalidadLabel[modalidad]}
    </Badge>
  );
}
