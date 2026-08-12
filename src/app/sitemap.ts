import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { SITE_URL } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clubs = await prisma.club.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = ["", "/clubs", "/clubs/new", "/faq", "/contact", "/privacy", "/terms"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const clubRoutes = clubs.map((club) => ({
    url: `${SITE_URL}/clubs/${club.slug}`,
    lastModified: club.updatedAt,
  }));

  return [...staticRoutes, ...clubRoutes];
}
