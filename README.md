# TalentFlow — Frontend (ATS)

Frontend del sistema de reclutamiento (ATS) TalentFlow, proyecto académico del curso **Desarrollo de aplicaciones Web avanzado con Node.js y Next.js** (Instituto Tecsup).

Consume el [backend](https://github.com/Josue-Zapata-v/TalentFlow-backend) vía `fetch` nativo. Ver `CLAUDE.md` para el contexto completo de arquitectura y diseño.

## Stack

- Next.js 15 (App Router), TypeScript
- Tailwind CSS v4 (config CSS-first, tokens en `src/app/globals.css`)
- shadcn/ui personalizado con los tokens de marca
- React Hook Form + Zod, Zustand, `lucide-react`
- Fuentes: Manrope (headings), Inter (body), IBM Plex Mono (datos/metadata)

## Requisitos previos

- Node.js 20 o superior
- Backend de TalentFlow corriendo (local o desplegado)

## Instalación

```bash
npm install
cp .env.example .env.local
```

Completa `.env.local` con la URL del backend (ver variables de entorno).

## Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend (ej. `http://localhost:4000/api` en desarrollo) |

## Correr en local

```bash
npm run dev
```

Disponible en `http://localhost:3000`.

## Build y producción

```bash
npm run build
npm start
```

## Despliegue

Vercel, conectado al repo `TalentFlow-frontend`. Variable de entorno `NEXT_PUBLIC_API_URL` apuntando al backend en Render.
