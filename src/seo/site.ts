// Search and social metadata for Theni Taxi. No DOM/React here — kept Node-safe
// so a future prerender/sitemap script can import it unchanged.

export const SITE = {
  name: 'Theni Taxi',
  url: 'https://www.thenitaxi.in',
  legalName: 'NESAM Tours and Travels Private Limited',
  phone: '+919025099990',
  phoneDisplay: '+91 90250 99990',
  whatsapp: '919025099990',
  email: 'support@nesamcabs.com',
  logo: '/favicon.svg',
  /** 1200×630 share card. */
  image: '/og-image.jpg',
  imageAlt: 'Theni Taxi — local & outstation taxi booking in Theni, Tamil Nadu',
  addressLocality: 'Theni',
  addressRegion: 'Tamil Nadu',
  postalCode: '625531',
  lat: 10.0104,
  lng: 77.4768,
} as const;

export const DEFAULT_DESCRIPTION =
  'Theni Taxi books local rides, outstation drop taxis and airport transfers across Theni, Bodinayakanur, Cumbum, Periyakulam, Madurai and Kodaikanal. Upfront fares, verified drivers, 24/7 service.';

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const ROBOTS_NOINDEX = 'noindex, nofollow';

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface SeoProps {
  /** Page title; " | Theni Taxi" is appended unless the brand is already in it. */
  title: string;
  description?: string;
  keywords?: string;
  /** Canonical path ('/theni-to-madurai-taxi') or absolute URL. */
  canonical?: string;
  noindex?: boolean;
  ogImage?: string;
  ogImageAlt?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** Page-level schema.org nodes (no @context needed). */
  schema?: object | object[];
}

export interface ResolvedSeo {
  title: string;
  description: string;
  keywords?: string;
  canonical: string | null;
  robots: string;
  image: string;
  imageAlt: string;
  schema: object | null;
}

export const absoluteUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;

export function breadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: absoluteUrl(b.path) })),
  };
}

export function faqSchema(faqs: ReadonlyArray<{ q: string; a: string }>): object {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

export function resolveSeo(p: SeoProps): ResolvedSeo {
  const graph: object[] = [];
  if (p.breadcrumbs?.length) graph.push(breadcrumbSchema(p.breadcrumbs));
  if (p.schema) graph.push(...(Array.isArray(p.schema) ? p.schema : [p.schema]));
  return {
    title: p.title.includes(SITE.name) ? p.title : `${p.title} | ${SITE.name}`,
    description: p.description || DEFAULT_DESCRIPTION,
    keywords: p.keywords,
    canonical: p.canonical ? absoluteUrl(p.canonical) : p.noindex ? null : absoluteUrl('/'),
    robots: p.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX,
    image: absoluteUrl(p.ogImage || SITE.image),
    imageAlt: p.ogImageAlt || (p.ogImage ? p.title : SITE.imageAlt),
    schema: graph.length ? { '@context': 'https://schema.org', '@graph': graph } : null,
  };
}

/** Area actually served out of Theni — used by siteSchema and the SEO content pages. */
export const SERVICE_TOWNS = ['Theni', 'Bodinayakanur', 'Cumbum', 'Periyakulam', 'Kambam', 'Chinnamanur', 'Uthamapalayam', 'Andipatti'];
export const CORRIDOR_CITIES = ['Madurai', 'Kodaikanal', 'Coimbatore', 'Dindigul', 'Tiruchirappalli', 'Munnar', 'Thekkady'];

/** The business itself — present on every page via index.html; kept here so a page can re-assert it. */
export function siteSchema(): object {
  const id = `${SITE.url}/#business`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TaxiService',
        '@id': id,
        name: SITE.name,
        legalName: SITE.legalName,
        parentOrganization: { '@type': 'Organization', name: SITE.legalName, url: 'https://nesamcabs.com/' },
        url: `${SITE.url}/`,
        logo: absoluteUrl(SITE.logo),
        image: absoluteUrl(SITE.image),
        description:
          'Local taxi, outstation one-way & round-trip cabs, airport transfers and hourly rentals in and around Theni, Tamil Nadu, with upfront fares and verified drivers.',
        telephone: SITE.phone,
        email: SITE.email,
        priceRange: '₹₹',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: SITE.phone,
          email: SITE.email,
          areaServed: 'IN',
          availableLanguage: ['English', 'Tamil'],
        },
        currenciesAccepted: 'INR',
        paymentAccepted: 'Cash, UPI',
        address: { '@type': 'PostalAddress', addressLocality: SITE.addressLocality, addressRegion: SITE.addressRegion, postalCode: SITE.postalCode, addressCountry: 'IN' },
        geo: { '@type': 'GeoCoordinates', latitude: SITE.lat, longitude: SITE.lng },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
        areaServed: [...SERVICE_TOWNS, ...CORRIDOR_CITIES].map((name) => ({ '@type': 'City', name })),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: `${SITE.url}/`,
        name: SITE.name,
        inLanguage: 'en-IN',
        publisher: { '@id': id },
      },
    ],
  };
}
