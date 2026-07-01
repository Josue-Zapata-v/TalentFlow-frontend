import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-(--breakpoint-xl) flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-foreground">TalentFlow</h1>
      <p className="max-w-md text-base text-muted-foreground">
        Sistema de Reclutamiento — scaffold en construcción. Próximo paso: listado público de vacantes.
      </p>
      <div className="flex items-center gap-3">
        <Button>Botón primario</Button>
        <Button variant="outline">Botón secundario</Button>
        <Button variant="destructive">Peligro</Button>
      </div>
      <p className="font-mono text-xs text-muted-foreground">2026-07-01T00:00:00Z</p>
    </main>
  );
}
