"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiError } from "@/lib/api-client";
import { EstadoPostulacion, Postulacion } from "@/types/shared";
import { postulacionesService } from "../services/postulacionesService";

const COLUMNAS: { estado: EstadoPostulacion; label: string }[] = [
  { estado: "POSTULADO", label: "Postulado" },
  { estado: "EN_REVISION", label: "En revisión" },
  { estado: "ENTREVISTA", label: "Entrevista" },
  { estado: "OFERTA", label: "Oferta" },
  { estado: "CONTRATADO", label: "Contratado" },
  { estado: "RECHAZADO", label: "Rechazado" },
];

interface KanbanBoardProps {
  postulaciones: Postulacion[];
  onChanged: () => void;
}

export function KanbanBoard({ postulaciones, onChanged }: KanbanBoardProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleChange(id: string, estado: EstadoPostulacion) {
    setPendingId(id);
    try {
      await postulacionesService.changeEstado(id, estado);
      onChanged();
    } catch (err) {
      window.alert(err instanceof ApiError ? err.message : "No se pudo cambiar el estado.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-4 sm:overflow-x-auto">
      {COLUMNAS.map((columna) => {
        const items = postulaciones.filter((p) => p.estado === columna.estado);

        return (
          <div key={columna.estado} className="flex flex-col gap-3 sm:w-64 sm:shrink-0">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
              {columna.label}
              <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground">
                {items.length}
              </span>
            </h2>

            <div className="flex flex-col gap-3">
              {items.map((postulacion) => (
                <div
                  key={postulacion.id}
                  className="flex flex-col gap-2 rounded-md border border-border bg-card p-4"
                >
                  <p className="font-heading text-sm font-bold text-foreground">
                    {postulacion.postulante.nombre}
                  </p>
                  <p className="text-xs text-muted-foreground">{postulacion.postulante.email}</p>
                  {postulacion.observaciones && (
                    <p className="text-xs text-muted-foreground">{postulacion.observaciones}</p>
                  )}
                  <Select
                    value={postulacion.estado}
                    onValueChange={(value) => handleChange(postulacion.id, value as EstadoPostulacion)}
                  >
                    <SelectTrigger
                      className="mt-1 w-full"
                      disabled={pendingId === postulacion.id}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMNAS.map((c) => (
                        <SelectItem key={c.estado} value={c.estado}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-xs text-muted-foreground">Sin postulantes en esta etapa.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
