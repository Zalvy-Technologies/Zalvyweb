/**
 * ZALVY JSON-LD helpers — typed Schema.org generators emitted from page server
 * components via a single <script type="application/ld+json"> tag.
 *
 * Why centralize:
 *  - Per-page Schema.org payloads are easy to drift (different `@context`s,
 *    mis-typed Offer `availability`, missing `sameAs`). A single typed surface
 *    keeps payloads valid and reviewable.
 *  - These helpers produce plain JSON-serializable objects; consumption happens
 *    via the <JsonLd/> component, which injects a single controlled script tag.
 *
 * Schema references are aligned to https://schema.org and Googles rich-results
 * spec; no vocab terms used without types in the official schema graph.
 */
import { site } from "@/lib/site";

type Graph = Record<string, unknown>;

/** Juridical Organization node — describes ZALVY as a software vendor org. */
export function organizationSchema(): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#organization`,
    name: site.legalName,
    alternateName: site.name,
    url: site.url,
    logo: `${site.url}${site.ogImage}`,
    description: site.description,
    foundingDate: String(site.founded),
    email: site.contact.email,
    sameAs: [site.social.x, site.social.linkedin, site.social.github, site.social.youtube, site.social.instagram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "enterprise sales",
        email: site.contact.enterprise,
        telephone: site.contact.phone,
        areaServed: "Global",
        availableLanguage: ["English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "careers",
        email: site.contact.internships,
        areaServed: "Global",
        availableLanguage: ["English"],
      },
    ],
  };
}

/** WebSite node with SearchAction — enables sitelinks search box eligibility. */
export function websiteSchema(): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}#organization` },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${site.url}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** BreadcrumbList — emitted on every inner page so the journey is legible to crawlers. */
export function breadcrumbSchema(items: { name: string; path: string }[]): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export interface ProductSpec {
  slug: string;
  name: string;
  description: string;
  /** Lowest tier price in USD — emitted as schema:PriceSpecification (monthly). */
  lowPriceUsd?: number;
  /** High-tier reference price in USD — for "starts from / up to" style listings. */
  highPriceUsd?: number;
}

/** SoftwareApplication node — one per ZALVY product surface. */
export function productSchema(spec: ProductSpec): Graph {
  const offers: Graph[] = [];
  if (typeof spec.lowPriceUsd === "number") {
    offers.push({
      "@type": "Offer",
      price: spec.lowPriceUsd.toFixed(2),
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: spec.lowPriceUsd.toFixed(2),
        priceCurrency: "USD",
        billingDuration: "P1M",
        billingIncrement: 1,
      },
      availability: "https://schema.org/InStock",
      seller: { "@id": `${site.url}#organization` },
      url: `${site.url}/platform/${spec.slug}`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}/platform/${spec.slug}#product`,
    name: spec.name,
    description: spec.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Cross-platform (web)",
    url: `${site.url}/platform/${spec.slug}`,
    publisher: { "@id": `${site.url}#organization` },
    offers,
  };
}

/** Service node — used for the studio + internship program (non-software surfaces). */
export function serviceSchema(spec: {
  slug: string;
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
}): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site.url}/${spec.slug}#service`,
    name: spec.name,
    description: spec.description,
    serviceType: spec.serviceType,
    areaServed: spec.areaServed ?? "Global",
    provider: { "@id": `${site.url}#organization` },
    url: `${site.url}/${spec.slug}`,
  };
}

/** FAQPage node — used on FAQ-rich inner pages to earn rich-result eligibility. */
export function faqSchema(faqs: { question: string; answer: string }[]): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}

/** JobPosting node — used on each /careers/:id route. */
export function jobPostingSchema(job: {
  id: string;
  title: string;
  description: string;
  location: string;
  remote: boolean;
  postedAt: string;
}): Graph {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.postedAt,
    jobLocationType: job.remote ? "TELECOMMUTE" : undefined,
    jobLocation: job.remote
      ? undefined
      : {
          "@type": "Place",
          address: { "@type": "PostalAddress", addressLocality: job.location },
        },
    hiringOrganization: { "@id": `${site.url}#organization` },
    identifier: { "@type": "PropertyValue", name: "ZALVY Careers", value: job.id },
  };
}

export interface JobSchemaInput {
  title: string;
  description: string;
  identifier: { name: string; value: string };
  datePosted: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization: { name: string; sameAs: string };
  jobLocation: { address: { addressLocality: string; addressCountry?: string } };
  baseSalary?: {
    currency: string;
    value: { minValue: number; maxValue: number; unitText: string };
  };
}

/** JobPosting @graph — emitted on the careers listing page. */
export function jobSchema(jobs: JobSchemaInput[]): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": jobs.map((job) => ({
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.datePosted,
      validThrough: job.validThrough,
      employmentType: job.employmentType ?? "FULL_TIME",
      hiringOrganization: { "@type": "Organization", name: job.hiringOrganization.name, sameAs: job.hiringOrganization.sameAs },
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", addressLocality: job.jobLocation.address.addressLocality, addressCountry: job.jobLocation.address.addressCountry ?? "US" },
      },
      identifier: { "@type": "PropertyValue", name: job.identifier.name, value: job.identifier.value },
      ...(job.baseSalary
        ? {
            baseSalary: {
              "@type": "MonetaryAmount",
              currency: job.baseSalary.currency,
              value: {
                "@type": "QuantitativeValue",
                minValue: job.baseSalary.value.minValue,
                maxValue: job.baseSalary.value.maxValue,
                unitText: job.baseSalary.value.unitText,
              },
            },
          }
        : {}),
    })),
  };
}

export interface BlogPostSchemaInput {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  author: { name: string };
  image: string;
}

/** Blog @graph — emitted on the engineering blog listing page. */
export function blogSchema(posts: BlogPostSchemaInput[]): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.headline,
      description: post.description,
      mainEntityOfPage: post.url,
      datePublished: post.datePublished,
      image: post.image,
      author: { "@type": "Person", name: post.author.name },
      publisher: { "@id": `${site.url}#organization` },
    })),
  };
}

/**
 * Merge an array of Graph nodes into a single `@graph` payload. More efficient
 * than emitting many script tags and is the recommended pattern from Google's
 * rich-results documentation for interlinked entities on a single page.
 */
export function graphSchema(nodes: Graph[]): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
