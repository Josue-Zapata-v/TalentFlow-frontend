"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ApiError } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { vacanteFormSchema, VacanteFormValues } from "../types";

interface VacanteFormProps {
  defaultValues?: Partial<VacanteFormValues>;
  onSubmit: (values: VacanteFormValues) => Promise<void>;
  submitLabel: string;
}

const DEFAULTS: VacanteFormValues = {
  titulo: "",
  descripcion: "",
  requisitos: "",
  ubicacion: "",
  modalidad: "REMOTO",
  salarioRango: "",
  categoria: "",
  estado: "BORRADOR",
};

const textareaClass =
  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function VacanteForm({ defaultValues, onSubmit, submitLabel }: VacanteFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VacanteFormValues>({
    resolver: zodResolver(vacanteFormSchema),
    defaultValues: { ...DEFAULTS, ...defaultValues },
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "No se pudo guardar la vacante.");
    }
  });

  return (
    <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input id="titulo" aria-invalid={!!errors.titulo} {...register("titulo")} />
        {errors.titulo && <p className="text-sm text-destructive">{errors.titulo.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <textarea
          id="descripcion"
          rows={4}
          className={textareaClass}
          aria-invalid={!!errors.descripcion}
          {...register("descripcion")}
        />
        {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="requisitos">Requisitos</Label>
        <textarea
          id="requisitos"
          rows={3}
          className={textareaClass}
          aria-invalid={!!errors.requisitos}
          {...register("requisitos")}
        />
        {errors.requisitos && <p className="text-sm text-destructive">{errors.requisitos.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input id="ubicacion" aria-invalid={!!errors.ubicacion} {...register("ubicacion")} />
          {errors.ubicacion && <p className="text-sm text-destructive">{errors.ubicacion.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="modalidad">Modalidad</Label>
          <Controller
            control={control}
            name="modalidad"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="modalidad" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REMOTO">Remoto</SelectItem>
                  <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                  <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="categoria">Categoría (opcional)</Label>
          <Input id="categoria" {...register("categoria")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="salarioRango">Rango salarial (opcional)</Label>
          <Input id="salarioRango" placeholder="Ej. S/ 3000 - S/ 4500" {...register("salarioRango")} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="estado">Estado</Label>
          <Controller
            control={control}
            name="estado"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="estado" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BORRADOR">Borrador</SelectItem>
                  <SelectItem value="ABIERTA">Abierta</SelectItem>
                  <SelectItem value="CERRADA">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-destructive">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting && <Spinner className="size-4 text-current" />}
        {isSubmitting ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
