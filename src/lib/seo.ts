import type { Metadata } from "next";
import type { Project } from "@/data/projects";
import { experience, site, siteUrl, skillGroups } from "@/data/site";

/**
 * Page metadata and structured data, in one place so every route says the same
 * things about the site and about whose it is.
 */

/**
 * Metadata for a sub-route: title, description, canonical, and matching Open
 * Graph + Twitter tags.
 *
 * Next merges metadata SHALLOWLY, so a page that sets `openGraph` replaces the
 * root layout's whole object. Pages that built their own lost og:site_name and
 * og:locale, and one that skipped `twitter` shared under the home page's title.
 * Going through this keeps all of it. og:image is left to each route's
 * opengraph-image file, which Next injects separately.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      type,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Structured data (JSON-LD) ──────────────────────────────────────────────
// Each page emits one @graph. The Person is described in full on the home page
// and referenced by @id elsewhere, with a name/url stub so each page still
// stands on its own when a crawler reads it in isolation.

const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

const personRef = { "@type": "Person", "@id": personId, name: site.name, url: siteUrl };

const currentRole = experience.find((e) => e.period.includes("Present"));

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: site.name,
        inLanguage: "en-US",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: `${site.name} · ${site.role}`,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: site.name,
        url: siteUrl,
        image: `${siteUrl}/personal-branding/portrait.jpg`,
        jobTitle: site.role,
        description: site.tagline,
        email: `mailto:${site.email}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.location.split(",")[0],
          addressRegion: site.location.split(", ")[1],
          addressCountry: "US",
        },
        ...(currentRole && {
          worksFor: { "@type": "Organization", name: currentRole.company },
        }),
        knowsAbout: skillGroups.flatMap((g) => g.items),
        sameAs: Object.values(site.socials),
      },
    ],
  };
}

function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${siteUrl}${crumb.path}`,
    })),
  };
}

export function caseStudyJsonLd(project: Project) {
  const url = `${siteUrl}/work/${project.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name: project.title,
        headline: project.title,
        description: project.summary,
        // The id matches generateImageMetadata in work/[slug]/opengraph-image.
        image: `${url}/opengraph-image/card`,
        dateCreated: project.year,
        keywords: project.tags.join(", "),
        inLanguage: "en-US",
        author: personRef,
        isPartOf: { "@id": websiteId },
      },
      breadcrumbs([
        { name: site.name, path: "/" },
        { name: project.title, path: `/work/${project.slug}` },
      ]),
    ],
  };
}

export function prototypeJsonLd({
  name,
  description,
  path,
  study,
}: {
  name: string;
  description: string;
  path: string;
  study: Project;
}) {
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#work`,
        url,
        name,
        description,
        image: `${url}/opengraph-image`,
        inLanguage: "en-US",
        author: personRef,
        isBasedOn: { "@id": `${siteUrl}/work/${study.slug}#work` },
        isPartOf: { "@id": websiteId },
      },
      breadcrumbs([
        { name: site.name, path: "/" },
        { name: study.title, path: `/work/${study.slug}` },
        { name, path },
      ]),
    ],
  };
}
