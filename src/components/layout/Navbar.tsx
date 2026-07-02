"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    router.push("/login");
  }

  const navLinks = (
    <>
      <Link
        href="/vacantes"
        className="text-sm font-medium text-foreground hover:text-primary"
        onClick={() => setMenuOpen(false)}
      >
        Vacantes
      </Link>
      {isAuthenticated && user && (
        <Link
          href={roleNav[user.rol].href}
          className="text-sm font-medium text-foreground hover:text-primary"
          onClick={() => setMenuOpen(false)}
        >
          {roleNav[user.rol].label}
        </Link>
      )}
    </>
  );

  const sessionControls = isHydrating ? null : isAuthenticated && user ? (
    <>
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
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
      <Link href="/login" onClick={() => setMenuOpen(false)}>
        <Button variant="outline">Iniciar sesión</Button>
      </Link>
      <Link href="/registro" onClick={() => setMenuOpen(false)}>
        <Button>Crear cuenta</Button>
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <nav className="mx-auto flex h-16 max-w-(--breakpoint-xl) items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-lg font-bold text-primary">
            TalentFlow
          </Link>
          <div className="hidden items-center gap-8 sm:flex">{navLinks}</div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">{sessionControls}</div>

        <button
          type="button"
          className="flex items-center justify-center rounded-md p-2 text-foreground sm:hidden"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
        </button>
      </nav>

      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">{navLinks}</div>
          <div className="flex flex-col gap-3">{sessionControls}</div>
        </div>
      )}
    </header>
  );
}
