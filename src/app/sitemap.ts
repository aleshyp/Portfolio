import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";
import { projects } from "@/data/projects";

/**
 * Sitemap: the home page, every case-study route, and any working demo a study
 * links to (`demoHref`). Next serves this at
 * /sitemap.xml. Derives URLs from `siteUrl` so it stays correct per-environment.
 *
 * No `lastModified`. It used to be the build time on every URL, which told
 * crawlers the whole site changed on every deploy. Google only trusts lastmod
 * when it's consistently accurate, so a date that's always "now" is worse than
 * none. Add a real per-page date here if one is ever tracked.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  for (const project of projects) {
    routes.push({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "yearly",
      priority: 0.8,
    });
    if (project.demoHref) {
      routes.push({
        url: `${siteUrl}${project.demoHref}`,
          changeFrequency: "yearly",
        priority: 0.6,
      });
    }
  }

  return routes;
}
