import type { MetadataRoute } from "next";
import { getPublicVacantes } from "@/modules/vacantes/services/vacantesService";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/vacantes`, lastModified: new Date() },
  ];

  const vacanteRoutes: MetadataRoute.Sitemap = [];
  const limit = 50;
  let page = 1;

  // Recorre todas las páginas de vacantes abiertas (el backend limita a 50 por página).
  while (true) {
    const { vacantes, pagination } = await getPublicVacantes({ page, limit });
    vacanteRoutes.push(
      ...vacantes.map((vacante) => ({
        url: `${SITE_URL}/vacantes/${vacante.slug}`,
        lastModified: new Date(vacante.createdAt),
      })),
    );

    if (page * limit >= pagination.total) break;
    page++;
  }

  return [...staticRoutes, ...vacanteRoutes];
}
