# CLAUDE.md — Frontend ATS (Applicant Tracking System)

Este archivo es el contexto de proyecto para Claude Code. Léelo completo antes de escribir o modificar código. Es la contraparte del `CLAUDE.md` del backend — este repo es **solo el frontend**, construido en Next.js, y consume la API REST del backend (Express + PostgreSQL) vía `fetch`.

---

## 1. Contexto general

Este frontend es la cara pública y privada de un **Sistema de Reclutamiento (ATS)**, proyecto académico del curso de Desarrollo Web con Node.js y Next.js. Referencias de producto real: **LinkedIn Jobs, Computrabajo, Indeed**. El usuario final espera la seriedad y claridad visual de esas plataformas, no la estética de un proyecto de curso.

Dos grandes zonas:
- **Pública** (SSR/SSG, indexable, optimizada para SEO): listado de vacantes, detalle de vacante, landing.
- **Privada** (autenticada, por rol): panel de Postulante, panel de Reclutador, panel de Administrador.

El backend ya expone: autenticación JWT, CRUD de Usuarios/Vacantes/Postulaciones, y gestión de estados del postulante. Este frontend NO reimplementa lógica de negocio — solo consume la API y la presenta.

---

## 2. Dirección de diseño (léase con máxima atención)

### Principio rector
**Limpio, elegante, corporativo, sin ruido visual.** Cada sección con propósito claro, jerarquía tipográfica evidente, mucho aire (whitespace), nada que compita por atención innecesariamente.

### Regla no negociable: CERO degradados
- **Ningún gradiente**, en ningún elemento: ni fondos, ni botones, ni texto, ni bordes, ni sombras, ni íconos.
- Todo color es **sólido y plano** (`background-color: #HEXVALUE`, nunca `linear-gradient(...)` ni `radial-gradient(...)`).
- Esto aplica también a estados hover/active: se resuelven con un color sólido distinto (más oscuro/claro), nunca con un gradiente ni con glow difuso.
- Sombras (`box-shadow`) permitidas solo como recurso sutil de elevación (cards, dropdowns, modales) — sombras suaves grises, nunca de color, nunca "neón".

### Fondo
- **Blanco (`#FFFFFF`) como base de toda la aplicación.** Es el fondo por defecto de body, contenedores principales, y la mayoría de las páginas.
- Para diferenciar secciones sin perder la base blanca, se usa un gris muy claro (`--color-surface`) en franjas alternas o cards, nunca un color saturado de fondo completo.

### Paleta de colores (tokens con nombre — usar SIEMPRE estas variables, nunca hex sueltos en componentes)

```css
:root {
  /* Base */
  --color-bg: #FFFFFF;           /* fondo principal de toda la app */
  --color-surface: #F7F8FA;      /* fondo alterno de secciones/cards, gris casi imperceptible */
  --color-border: #E3E6EA;       /* bordes, divisores, líneas sutiles */

  /* Texto */
  --color-text: #1A1D23;         /* texto principal, casi negro, no negro puro */
  --color-text-muted: #5B6470;   /* texto secundario, labels, metadata */
  --color-text-inverse: #FFFFFF; /* texto sobre fondos oscuros (ej. botón primario) */

  /* Marca / acción */
  --color-primary: #1B3A6B;        /* azul marino profundo — navbar, links, botón primario, headers */
  --color-primary-hover: #142C52;  /* mismo azul, más oscuro, para hover — SÓLIDO, no gradiente */
  --color-accent: #0E7C66;         /* verde-teal — CTAs secundarios, elementos de "match"/progreso positivo */
  --color-accent-hover: #0B6353;

  /* Estados semánticos (planos, sin gradiente) */
  --color-success: #1F7A4D;
  --color-warning: #B7791F;
  --color-error: #C0362C;
  --color-info: #2A5C8A;
}
```

### Paleta de estados de postulación (para badges en el panel de Reclutador — todos colores sólidos)

| Estado | Color | Hex |
|---|---|---|
| Postulado | Gris azulado | `#64748B` |
| En revisión | Ámbar | `#B7791F` |
| Entrevista | Violeta | `#6D28D9` |
| Oferta | Teal | `#0E7C66` |
| Contratado | Verde | `#1F7A4D` |
| Rechazado | Rojo | `#C0362C` |

Cada badge: fondo del color al 10-12% de opacidad + texto/borde con el color sólido al 100%. Nunca fondo sólido saturado cubriendo todo el badge (se ve muy "alerta"/infantil) y jamás gradiente entre dos de estos colores.

### Tipografía

Combinación deliberada, no la default de cualquier proyecto Next.js con Tailwind:

- **Display / Headings**: `Manrope` (geométrica, moderna, con carácter pero seria — se usa en `h1`-`h3` y elementos destacados como el título de una vacante).
- **Body / UI general**: `Inter` (máxima legibilidad, estándar probado para plataformas de datos y formularios — se usa en párrafos, labels, botones, navegación).
- **Utilitaria / datos**: `IBM Plex Mono` (para fechas, IDs de vacante, códigos de estado, metadata técnica — le da un toque "de sistema serio" sin recargar).

Ambas (`Manrope`, `Inter`) se cargan vía `next/font/google` para optimización automática (evita layout shift, mejora Lighthouse).

Escala tipográfica sugerida (usar `clamp()` para fluidez responsive):
```
--text-xs:   0.75rem   (12px) — metadata, captions
--text-sm:   0.875rem  (14px) — texto secundario, labels de formulario
--text-base: 1rem      (16px) — cuerpo de texto
--text-lg:   1.125rem  (18px) — texto destacado, subtítulos
--text-xl:   1.5rem    (24px) — h3
--text-2xl:  2rem      (32px) — h2
--text-3xl:  2.75rem   (44px) — h1 / hero
```

Pesos: `Manrope` en 600-700 para headings (nunca 800/900 — se ve demasiado "marketing agresivo" para un ATS corporativo). `Inter` en 400 para cuerpo, 500 para labels/botones, 600 para énfasis puntual.

### Layout y estructura visual

- **Grid de 12 columnas**, contenedor máximo `1280px` centrado, padding lateral responsive.
- Secciones bien delimitadas por **espaciado generoso** (no por líneas divisorias pesadas) — usar `--color-border` solo donde realmente aporta (tablas, separación navbar/contenido).
- **Border-radius consistente y moderado**: `--radius-sm: 6px` (inputs, badges), `--radius-md: 10px` (cards, botones), `--radius-lg: 16px` (modales, contenedores grandes). Nada de esquinas 100% cuadradas (se ve tosco) ni excesivamente redondeadas (se ve infantil).
- **Botones**: color sólido de fondo, sin gradiente, sin sombra de color, transición simple de color en hover (150-200ms). Botón primario = `--color-primary`; botón secundario = borde `--color-primary` con fondo transparente/blanco; botón de peligro (rechazar postulante, eliminar vacante) = `--color-error`.
- **Cards de vacante** (listado público, estilo Computrabajo/LinkedIn Jobs): título, empresa/ubicación, modalidad como badge plano, fecha de publicación en `IBM Plex Mono` pequeño, salario si aplica. Hover: leve elevación de sombra + borde `--color-primary`, sin cambiar el fondo a gradiente ni color saturado.
- **Navbar**: fondo blanco, borde inferior sutil (`--color-border`), logo + nav + estado de sesión/avatar a la derecha. Sticky al hacer scroll.

### Signature visual del proyecto
El elemento distintivo y memorable de este ATS: **la barra de progreso de estado del postulante** (Postulado → Revisión → Entrevista → Oferta → Contratado), presente tanto en el perfil del postulante como en el panel del reclutador, usando los colores sólidos de la tabla de estados como puntos de una línea de tiempo horizontal — sin gradiente conectando los puntos, solo la línea en `--color-border` y los círculos de estado en su color sólido correspondiente, con el estado actual resaltado con un anillo (`box-shadow` sutil, no glow).

---

## 3. Stack tecnológico (Frontend)

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 (tokens de la sección 2 definidos como `@theme` en `globals.css`, config CSS-first, sin `tailwind.config.ts`) |
| Componentes UI base | shadcn/ui (solo como base accesible — se personaliza siempre con los tokens de marca, nunca se deja el estilo default) |
| Formularios | React Hook Form + Zod (mismo schema de validación que el backend, adaptado) |
| Estado global (sesión/auth) | Zustand (ligero, evita el boilerplate de Redux para un proyecto de este tamaño) |
| Data fetching | `fetch` nativo envuelto en una capa de servicios (`services/`), usando Server Components donde sea posible para SSR/SEO |
| Íconos | `lucide-react` (set consistente, sin mezclar librerías de íconos) |
| Fuentes | `next/font/google` (Manrope, Inter, IBM Plex Mono) |
| Testing | Jest + React Testing Library (mínimo: formularios críticos, auth) |

**Por qué Server Components + fetch nativo**: es lo que exige el requerimiento del curso ("integración mediante fetch") y además es lo que permite que las páginas públicas de vacantes se rendericen en servidor para SEO real, no solo CSR con `useEffect`.

**Tailwind v4**: configuración CSS-first (`@theme` dentro de `globals.css`), no `tailwind.config.ts` con `theme.extend` al estilo v3. Encaja naturalmente con los tokens CSS de la sección 2 — se definen una sola vez como `@theme` y Tailwind genera las utilidades automáticamente.

---

## 3bis. Estrategia de autenticación (decisión de arquitectura — leer antes de tocar `auth/` o `(dashboard)/`)

El backend emite el **access token en el body JSON** (no en cookie) y el **refresh token en una cookie `httpOnly`** con `path: /api/auth` y `SameSite=None; Secure` en producción (frontend en Vercel, backend en Render — dominios distintos). Esto tiene una consecuencia directa sobre qué puede o no ser Server Component:

- Un Server Component se ejecuta en el servidor en una request nueva cada vez (serverless en Vercel) — **no tiene memoria persistente entre requests**. Si el access token vive en memoria del cliente (Zustand), ningún Server Component puede leerlo para llamar rutas protegidas del backend.
- **Regla concreta**: las rutas públicas (`(public)/`) son Server Components con SSR/SSG real, sin necesidad de auth. Las rutas privadas (`(dashboard)/postulante`, `/reclutador`, `/admin`) son **Client Components** que hacen fetch después del mount usando el access token guardado en el store de Zustand — no hay SSR de datos autenticados, y está bien así (no son páginas que necesiten SEO).
- **Rehidratación al cargar la app**: como el access token vive solo en memoria, un refresh de página (F5) lo pierde. El layout raíz (o un provider cliente temprano) debe intentar una llamada silenciosa a `/api/auth/refresh` al montar (usa la cookie httpOnly automáticamente) para regenerar el access token en el store antes de renderizar el dashboard. Sin esto, la sesión se sentirá "rota" en cada recarga.
- **Reintento en 401**: `lib/api-client.ts` debe interceptar una respuesta 401 de cualquier endpoint protegido, intentar refrescar una vez vía `/api/auth/refresh`, reintentar la request original con el nuevo token, y si el refresh también falla, cerrar sesión y redirigir a `/login`.
- **`credentials: 'include'`** es necesario en las cuatro llamadas de `/api/auth/*` (`register`, `login`, `refresh`, `logout`) — todas leen o escriben la cookie httpOnly del refresh token, y sin `credentials: 'include'` el navegador ignora el `Set-Cookie` en una respuesta cross-domain (Vercel/Render). El resto de llamadas autenticadas usan solo el header `Authorization: Bearer <token>`, sin necesidad de `credentials`. `lib/api-client.ts` ya aplica esto automáticamente según el prefijo de la ruta (`/auth/*` → `include`).

### `middleware.ts` y protección de rutas por rol

El middleware de Next.js corre en el Edge y solo puede leer cookies del dominio de Vercel — nunca va a ver el JWT (vive en memoria) ni la cookie httpOnly del backend (pertenece al dominio de Render). Para que el middleware pueda decidir qué UI mostrar:

- Al hacer login exitoso, además de guardar el access token en Zustand, el frontend setea **una cookie propia, liviana y NO-httpOnly** (ej. `tf_role=RECLUTADOR`) sin datos sensibles, solo con el rol — se borra en logout.
- El middleware lee esa cookie únicamente para UX (mostrar/ocultar rutas, evitar el parpadeo de "carga y luego redirige"). **Nunca es el mecanismo de seguridad real** — la autorización de verdad la sigue validando el backend en cada request, como ya dice la sección 11.

---

## 4. Arquitectura y principios SOLID aplicados al frontend

Igual que en el backend, se organiza por **features/módulos**, no por tipo de archivo genérico, para mantenerlo escalable y fácil de mantener:

```
frontend/
├── src/
│   ├── middleware.ts                     # Next.js lo detecta solo en esta ruta exacta; lee la cookie tf_role (UX-only)
│   ├── app/                              # App Router de Next.js
│   │   ├── (public)/                     # Rutas públicas, indexables
│   │   │   ├── page.tsx                  # Landing / home
│   │   │   ├── vacantes/
│   │   │   │   ├── page.tsx              # Listado de vacantes (SSR/ISR)
│   │   │   │   └── [slug]/page.tsx       # Detalle de vacante (SSG/ISR + generateMetadata)
│   │   │   ├── sitemap.ts                # Sitemap dinámico
│   │   │   └── robots.ts                 # robots.txt dinámico
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── registro/page.tsx
│   │   ├── (dashboard)/                  # Rutas privadas, protegidas por middleware
│   │   │   ├── postulante/
│   │   │   ├── reclutador/
│   │   │   └── admin/
│   │   ├── layout.tsx                    # Layout raíz (fuentes, providers)
│   │   └── globals.css                   # Tokens CSS (sección 2) + Tailwind base
│   ├── modules/                          # Lógica de dominio por feature (igual que el backend)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/                    # useAuth, useLogin, etc.
│   │   │   ├── services/                 # authService.ts (llamadas fetch a /api/auth)
│   │   │   └── types.ts
│   │   ├── vacantes/
│   │   │   ├── components/               # VacanteCard, VacanteFilterBar, VacanteDetail
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types.ts
│   │   └── postulaciones/
│   │       ├── components/               # EstadoTimeline, PostulacionCard, KanbanBoard
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   ├── components/
│   │   ├── ui/                           # Componentes shadcn/ui personalizados con tokens de marca
│   │   └── layout/                       # Navbar, Footer, Sidebar del dashboard
│   ├── lib/
│   │   ├── api-client.ts                 # wrapper de fetch (Bearer header, retry-on-401 con refresh, manejo de errores)
│   │   └── utils.ts
│   ├── store/
│   │   └── auth-store.ts                 # Zustand store de sesión
│   └── types/
│       └── shared.ts                     # tipos compartidos (deben espejar los DTOs del backend)
├── public/
│   └── ...                               # imágenes optimizadas, favicon, og-image
├── next.config.ts                        # Tailwind v4: sin tailwind.config.ts, tokens via @theme en globals.css
├── .env.example
└── README.md
```

### Cómo se aplica SOLID en el frontend
- **S**: cada componente/hook/servicio tiene una única responsabilidad — `VacanteCard` solo presenta, `useVacantes` solo maneja el fetching y estado, `vacantesService` solo sabe hablar con la API.
- **O**: componentes de UI (`components/ui/`) extendibles vía props/composición, no modificados directamente para cada caso de uso nuevo.
- **L**: cualquier variante de card/botón debe poder sustituir a otra del mismo tipo sin romper el layout que la contiene.
- **I**: hooks pequeños y específicos (`useVacante(slug)`, `useCrearPostulacion()`) en vez de un hook gigante `useVacantesTodo()`.
- **D**: los componentes dependen de la capa `services/` (abstracción sobre `fetch`), nunca hacen `fetch` directo inline — así, si mañana cambia la URL base o la forma de autenticar requests, se cambia en un solo lugar.

**Regla importante**: el tipado de `types/shared.ts` debe reflejar exactamente los DTOs de respuesta del backend (mismo `success/data/message` o `success/error` del formato de API definido en el CLAUDE.md del backend) — así se detectan desincronizaciones en tiempo de compilación, no en producción.

---

## 5. SEO y optimización (requerimiento obligatorio del curso)

- **Metadata dinámica** con `generateMetadata` en cada página pública, especialmente `vacantes/[slug]` (título con el nombre real de la vacante, descripción generada desde el resumen del puesto, Open Graph image).
- **Sitemap dinámico** (`app/sitemap.ts`) que consulte el listado de vacantes activas al backend y las incluya con su `lastModified`.
- **robots.txt dinámico** (`app/robots.ts`): permite indexar `/` y `/vacantes/*`, bloquea `/postulante`, `/reclutador`, `/admin`, `/login`, `/registro`.
- **Imágenes**: siempre `next/image`, nunca `<img>` plano — con `sizes` y `priority` correctamente configurados en imágenes above-the-fold (ej. logo, hero).
- **Server Components por defecto**: solo usar `"use client"` donde realmente se necesite interactividad (formularios, dropdowns, el Kanban de estados) — maximiza contenido renderizado en servidor, mejor para SEO y Lighthouse.
- **Semántica HTML real**: `<nav>`, `<main>`, `<article>` para cada vacante, `<h1>` único por página, jerarquía de headings correcta — no todo en `<div>`.
- **Meta objetivo: Lighthouse ≥ 85** en Performance, Accessibility, Best Practices y SEO — validar con Lighthouse en cada página pública antes de dar por cerrado el sprint de esa página, no solo al final del proyecto.

---

## 6. Formularios y validación

- React Hook Form + Zod resolver en todos los formularios (login, registro, crear/editar vacante, postularse, cambiar estado).
- Mismos criterios de validación que el backend (longitud mínima de password, formato de email, campos obligatorios) — evita que el usuario descubra un error de validación solo después de enviar al servidor.
- Mensajes de error en español, claros, específicos ("La contraseña debe tener al menos 8 caracteres", no "Campo inválido").
- Estados de carga (`isSubmitting`) siempre visibles en botones de envío — nunca dejar al usuario sin feedback tras un click.

---

## 7. Responsive y accesibilidad

- **Mobile-first**: diseñar primero para 375px de ancho, expandir con breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`).
- El listado de vacantes pasa de grid de 3 columnas (desktop) → 2 (tablet) → 1 (mobile), sin perder legibilidad de badges/metadata.
- El Kanban de estados de reclutador se colapsa a vista de lista/acordeón en mobile (un tablero Kanban horizontal no funciona bien en pantallas chicas).
- Contraste de color AA mínimo en todo texto sobre `--color-bg`/`--color-surface` (los tokens de la sección 2 ya están pensados para cumplir esto).
- Focus visible en todos los elementos interactivos (nunca `outline: none` sin un reemplazo visual claro).
- Todo ícono decorativo con `aria-hidden`, todo ícono funcional (botón de solo ícono) con `aria-label`.

---

## 8. Checklist de requerimientos obligatorios del curso (Frontend)

- [ ] Login y Registro conectados al backend (access token en memoria vía Zustand, refresh token en cookie httpOnly del backend, rehidratación silenciosa al cargar la app — ver sección 3bis)
- [ ] Rutas protegidas por rol en el frontend (middleware de Next.js) — Y recordar que la protección real vive en el backend, esto es solo UX
- [ ] Metadata dinámica en páginas públicas
- [ ] `sitemap.ts` y `robots.ts` funcionando en producción
- [ ] Imágenes optimizadas con `next/image`
- [ ] Lighthouse ≥ 85 verificado y documentado (con captura) en cada página pública clave
- [ ] Integración 100% vía `fetch` (sin Axios ni librerías de fetching de terceros)
- [ ] Formularios con validación (login, registro, crear vacante, postular, cambiar estado)
- [ ] Navegación dinámica según rol autenticado (navbar distinta para Postulante/Reclutador/Admin)
- [ ] Diseño responsive verificado en mobile, tablet y desktop
- [ ] Desplegado en Vercel, con `NEXT_PUBLIC_API_URL` apuntando al backend en Render
- [ ] Cero gradientes en todo el proyecto (revisión visual final antes de la entrega)

---

## 9. Despliegue

- **Vercel**, conectado directamente al repo de GitHub `TalentFlow-frontend` (misma convención que `TalentFlow-backend`).
- Variable de entorno `NEXT_PUBLIC_API_URL` apuntando a la URL pública del backend en Render.
- Verificar CORS desde el backend una vez se tenga la URL final de Vercel (el backend debe tener esa URL exacta en `CORS_ORIGIN`).
- Vercel genera preview deployments automáticos por cada PR — útil para revisar visualmente antes de mergear a `main`/producción.

---

## 10. Convenciones de código

- Componentes en `PascalCase.tsx`, hooks en `useAlgo.ts`, servicios en `algoService.ts` — mismo criterio de consistencia que el backend.
- Un componente, un archivo. Si un componente supera ~150 líneas, evaluar dividirlo en subcomponentes dentro de su misma carpeta de módulo.
- Nunca estilos inline (`style={{...}}`) salvo casos justificados de valores dinámicos calculados en runtime — todo lo demás vía clases de Tailwind usando los tokens definidos.
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`), igual que el backend.

---

## 11. Lo que NO hacer

- **Ningún gradiente, en absolutamente nada.** Este es el punto que más se repite en este documento a propósito.
- No usar Axios ni React Query — solo `fetch` nativo (requerimiento explícito del curso).
- No hacer `fetch` directo dentro de componentes — siempre a través de `services/`.
- No dejar rutas privadas sin protección de middleware, aunque el backend ya las proteja (defensa en profundidad + mejor UX, evita mostrar UI que luego falla).
- No usar `<img>` nativo para contenido — siempre `next/image`.
- No mezclar lógica de un módulo dentro de otro (ej. lógica de `postulaciones` viviendo dentro de `components/vacantes/`).
- No dejar textos de error genéricos tipo "Algo salió mal" — siempre decir qué pasó y, si aplica, qué hacer.

---

## 12. Nota final

Este frontend y el backend (ver su `CLAUDE.md`) forman un solo producto para efectos de evaluación, aunque vivan en repos separados. Antes de dar cualquier feature por terminada, verificar que el contrato de datos (tipos, formato de respuesta, nombres de campos) coincide exactamente entre ambos — la fuente de verdad de esos contratos es el backend.