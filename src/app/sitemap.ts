import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { projects } from "@/data/projects";

/**
 * Sitemap: the home page plus every case-study route. Next serves this at
 * /sitemap.xml. Derives URLs from `siteUrl` so it stays correct per-environment.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  for (const project of projects) {
    routes.push({
      url: `${siteUrl}/work/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    });
  }

  return routes;
}
