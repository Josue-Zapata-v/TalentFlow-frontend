import { NextRequest, NextResponse } from "next/server";
import { Rol } from "@/types/shared";

// Protección solo de UX: la cookie tf_role es liviana, no-httpOnly y sin JWT
// (ver CLAUDE.md sección 3bis). La autorización real vive siempre en el
// backend; esto únicamente evita mostrar/parpadear UI que luego fallaría.
const ROLE_COOKIE_NAME = "tf_role";

const roleHomeRoute: Record<Rol, string> = {
  ADMIN: "/admin",
  RECLUTADOR: "/reclutador",
  POSTULANTE: "/postulante",
};

const protectedPrefixes: { prefix: string; role: Rol }[] = [
  { prefix: "/postulante", role: "POSTULANTE" },
  { prefix: "/reclutador", role: "RECLUTADOR" },
  { prefix: "/admin", role: "ADMIN" },
];

const authPages = ["/login", "/registro"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE_NAME)?.value as Rol | undefined;

  const matchedProtected = protectedPrefixes.find((p) => pathname.startsWith(p.prefix));

  if (matchedProtected) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== matchedProtected.role) {
      return NextResponse.redirect(new URL(roleHomeRoute[role], request.url));
    }
  }

  if (authPages.includes(pathname) && role) {
    return NextResponse.redirect(new URL(roleHomeRoute[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/postulante/:path*", "/reclutador/:path*", "/admin/:path*", "/login", "/registro"],
};
