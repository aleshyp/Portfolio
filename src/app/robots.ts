import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/site";

/**
 * robots.txt: allow all crawlers and point them at the sitemap.
 * Next serves this at /robots.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
