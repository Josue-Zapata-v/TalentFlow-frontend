"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function VacanteFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [ubicacion, setUbicacion] = useState(searchParams.get("ubicacion") ?? "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") ?? "");
  const modalidad = searchParams.get("modalidad") ?? "TODAS";

  function navigate(next: { ubicacion?: string; modalidad?: string; categoria?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const merged = { ubicacion, modalidad, categoria, ...next };

    (["ubicacion", "modalidad", "categoria"] as const).forEach((key) => {
      const value = merged[key];
      if (value && value !== "TODAS") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    params.delete("page");

    router.push(params.size ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        navigate({});
      }}
      className="flex flex-wrap items-end gap-4 rounded-md border border-border bg-card p-4"
    >
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ubicacion">Ubicación</Label>
        <Input
          id="ubicacion"
          placeholder="Ej. Lima"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-40"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="modalidad">Modalidad</Label>
        <Select value={modalidad} onValueChange={(value) => navigate({ modalidad: value ?? "TODAS" })}>
          <SelectTrigger id="modalidad" className="w-40">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAS">Todas</SelectItem>
            <SelectItem value="REMOTO">Remoto</SelectItem>
            <SelectItem value="PRESENCIAL">Presencial</SelectItem>
            <SelectItem value="HIBRIDO">Híbrido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="categoria">Categoría</Label>
        <Input
          id="categoria"
          placeholder="Ej. Backend"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-40"
        />
      </div>

      <Button type="submit">Buscar</Button>
    </form>
  );
}
