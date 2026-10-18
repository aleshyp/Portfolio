import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { projects } from "@/data/projects";

/**
 * Sitemap: the home page, every case-study route, and any working demo a study
 * links to (`demoHref`). Next serves this at
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
    if (project.demoHref) {
      routes.push({
        url: `${siteUrl}${project.demoHref}`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return routes;
}
