/**
 * SEO constants and helpers for TrueCare Health At Home
 */

export const SITE_URL = "https://www.truecarebharat.com";
export const SITE_NAME = "TrueCare Health At Home";
export const SITE_TAGLINE = "Professional Home Healthcare Services in Dehradun";
export const SITE_DESCRIPTION =
  "TrueCare Health At Home provides professional, compassionate, and reliable home healthcare services in Dehradun, Uttarakhand. Skilled nursing, elderly care, physiotherapy & more — delivered at your doorstep.";

export const BUSINESS_INFO = {
  name: "TrueCare Health At Home",
  legalName: "TrueCare Health At Home",
  url: SITE_URL,
  logo: `${SITE_URL}/hero-nurse.png`,
  phone: "", // fetched from DB at runtime
  email: "", // fetched from DB at runtime
  address: {
    streetAddress: "",
    addressLocality: "Dehradun",
    addressRegion: "Uttarakhand",
    postalCode: "",
    addressCountry: "IN",
  },
  geo: {
    latitude: 30.2877649,
    longitude: 78.0624717,
  },
  areaServed: "Dehradun, Uttarakhand",
};

/**
 * Generate a canonical URL for a given path.
 */
export function canonicalUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Generate LocalBusiness JSON-LD structured data.
 */
export function generateLocalBusinessJsonLd(overrides?: {
  phone?: string;
  email?: string;
  address?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.url,
    logo: BUSINESS_INFO.logo,
    image: BUSINESS_INFO.logo,
    description: SITE_DESCRIPTION,
    telephone: overrides?.phone || BUSINESS_INFO.phone,
    email: overrides?.email || BUSINESS_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: overrides?.address || BUSINESS_INFO.address.streetAddress,
      addressLocality: BUSINESS_INFO.address.addressLocality,
      addressRegion: BUSINESS_INFO.address.addressRegion,
      addressCountry: BUSINESS_INFO.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_INFO.geo.latitude,
      longitude: BUSINESS_INFO.geo.longitude,
    },
    areaServed: {
      "@type": "City",
      name: "Dehradun",
      "@id": "https://www.wikidata.org/wiki/Q200663",
    },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    sameAs: [],
  };
}

/**
 * Generate WebSite JSON-LD structured data (for sitelinks searchbox).
 */
export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blogs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD structured data.
 */
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate BlogPosting JSON-LD structured data.
 */
export function generateBlogPostingJsonLd(blog: {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  author_name?: string;
  published_at?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || "",
    image: blog.cover_image || BUSINESS_INFO.logo,
    url: canonicalUrl(`/blogs/${blog.slug}`),
    datePublished: blog.published_at,
    dateModified: blog.published_at,
    author: {
      "@type": "Person",
      name: blog.author_name || "TrueCare Team",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: BUSINESS_INFO.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl(`/blogs/${blog.slug}`),
    },
  };
}

/**
 * Generate FAQPage JSON-LD structured data.
 */
export function generateFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
