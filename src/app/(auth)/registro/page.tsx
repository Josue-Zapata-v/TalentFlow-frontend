"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRegister } from "@/modules/auth/hooks/useRegister";

export default function RegistroPage() {
  const { form, onSubmit, serverError, isSubmitting } = useRegister();
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground">Crea tu cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Únete a TalentFlow como postulante o reclutador.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            autoComplete="name"
            aria-invalid={!!errors.nombre}
            {...register("nombre")}
          />
          {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rol">Quiero registrarme como</Label>
          <Controller
            control={control}
            name="rol"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="rol" className="w-full">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POSTULANTE">Postulante</SelectItem>
                  <SelectItem value="RECLUTADOR">Reclutador</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.rol && <p className="text-sm text-destructive">{errors.rol.message}</p>}
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-destructive">
            {serverError}
          </p>
        )}

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
