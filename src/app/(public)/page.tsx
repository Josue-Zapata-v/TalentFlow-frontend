import { Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VacanteCard } from "@/modules/vacantes/components/VacanteCard";
import { getPublicVacantes } from "@/modules/vacantes/services/vacantesService";

export default async function Home() {
  const { vacantes } = await getPublicVacantes({ limit: 3 });

  return (
    <main>
      <section className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Encuentra tu próxima oportunidad
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Vacantes reales, procesos claros. Postúlate o gestiona tu reclutamiento desde un solo lugar.
        </p>

        <form action="/vacantes" method="get" className="flex w-full max-w-md items-center gap-2">
          <Input name="ubicacion" placeholder="Busca por ubicación, ej. Lima" className="flex-1" />
          <Button type="submit">
            <Search className="size-4" aria-hidden />
            Buscar
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <Link href="/vacantes">
            <Button variant="outline">Ver todas las vacantes</Button>
          </Link>
          <Link href="/registro">
            <Button variant="outline">Crear cuenta</Button>
          </Link>
        </div>
      </section>

      {vacantes.length > 0 && (
        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-(--breakpoint-xl)">
            <h2 className="font-heading text-2xl font-bold text-foreground">Vacantes destacadas</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vacantes.map((vacante) => (
                <VacanteCard key={vacante.id} vacante={vacante} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
