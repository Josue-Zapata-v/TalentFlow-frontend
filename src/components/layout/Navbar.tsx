"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Rol } from "@/types/shared";

const roleNav: Record<Rol, { href: string; label: string }> = {
  POSTULANTE: { href: "/postulante", label: "Mis postulaciones" },
  RECLUTADOR: { href: "/reclutador", label: "Mis vacantes" },
  ADMIN: { href: "/admin", label: "Panel admin" },
};

export function Navbar() {
  const { user, isAuthenticated, isHydrating, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav className="mx-auto flex h-16 max-w-(--breakpoint-xl) items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-lg font-bold text-primary">
            TalentFlow
          </Link>
          <Link href="/vacantes" className="text-sm font-medium text-foreground hover:text-primary">
            Vacantes
          </Link>
          {isAuthenticated && user && (
            <Link
              href={roleNav[user.rol].href}
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              {roleNav[user.rol].label}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isHydrating ? null : isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                >
                  {user.nombre.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-muted-foreground">{user.nombre}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Iniciar sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Crear cuenta</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
