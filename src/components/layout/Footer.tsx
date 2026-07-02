import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-(--breakpoint-xl) flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} TalentFlow — Proyecto académico, Instituto Tecsup.</p>
        <div className="flex items-center gap-4">
          <Link href="/vacantes" className="hover:text-primary">
            Vacantes
          </Link>
          <Link href="/login" className="hover:text-primary">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </footer>
  );
}
