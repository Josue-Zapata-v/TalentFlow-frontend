import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-(--breakpoint-xl) flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-heading text-3xl font-bold text-foreground">TalentFlow</h1>
      <p className="max-w-md text-base text-muted-foreground">
        Encuentra tu próxima oportunidad o gestiona tus procesos de reclutamiento.
      </p>
      <div className="flex items-center gap-3">
        <Link href="/vacantes">
          <Button>Ver vacantes</Button>
        </Link>
        <Link href="/registro">
          <Button variant="outline">Crear cuenta</Button>
        </Link>
      </div>
    </main>
  );
}
