/**
 * JSON-LD structured data.
 *
 * Deliberately omitted: aggregateRating and Review. Marking up reviews that
 * have not actually been left is a manual-action risk, and Google filters
 * self-serving review markup anyway.
 *
 * Once data/testimonials.mjs holds three or more REAL reviews, add this to
 * businessNode() and the stars show up in search results:
 *
 *   import { testimonials } from '../../data/testimonials.mjs';
 *   ...
 *   if (testimonials.length >= 3) {
 *     node.aggregateRating = {
 *       '@type': 'AggregateRating',
 *       ratingValue: (testimonials.reduce((t, r) => t + r.stars, 0) / testimonials.length).toFixed(1),
 *       reviewCount: testimonials.length,
 *       bestRating: 5,
 *     };
 *     node.review = testimonials.map((r) => ({
 *       '@type': 'Review',
 *       author: { '@type': 'Person', name: r.name },
 *       reviewRating: { '@type': 'Rating', ratingValue: r.stars, bestRating: 5 },
 *       reviewBody: r.quote,
 *     }));
 *   }
 */
import { site } from '../../data/site.mjs';
import { services } from '../../data/services.mjs';
import { cities, additional, counties } from '../../data/areas.mjs';

const abs = (path = '/') => site.url.replace(/\/$/, '') + path;
export const BUSINESS_ID = abs('/#business');
const WEBSITE_ID = abs('/#website');

/** The business itself — referenced by @id from every other node. */
export function businessNode() {
  const node = {
    '@type': ['GeneralContractor', 'LocalBusiness'],
    '@id': BUSINESS_ID,
    name: site.name,
    legalName: site.legalName,
    url: abs('/'),
    description: site.shortDescription,
    slogan: site.slogan,
    telephone: site.phoneDisplay,
    email: site.email,
    image: abs('/assets/img/og-default.png'),
    logo: {
      '@type': 'ImageObject',
      url: abs('/assets/img/logo.png'),
      caption: site.name,
    },
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Check, Credit Card',
    address: {
      '@type': 'PostalAddress',
      ...(site.streetAddress ? { streetAddress: site.streetAddress } : {}),
      addressLocality: site.city,
      addressRegion: site.state,
      postalCode: site.postalCode,
      addressCountry: site.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: [
      ...cities.map((c) => ({ '@type': 'City', name: c.name, address: { '@type': 'PostalAddress', addressLocality: c.name, addressRegion: site.state, addressCountry: site.country } })),
      ...counties.map((c) => ({ '@type': 'AdministrativeArea', name: c })),
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      geoRadius: String(site.serviceRadiusMiles * 1609),
    },
    openingHoursSpecification: site.hours
      .filter((h) => h.opens)
      .map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.schema, opens: h.opens, closes: h.closes })),
    sameAs: [site.social.facebook, site.social.instagram].filter(Boolean),
    knowsAbout: [
      'concrete driveways', 'stamped concrete patios', 'concrete sidewalks',
      'concrete steps and porches', 'shed and garage pads', 'excavation',
      'site preparation', 'grading and drainage', 'retaining walls', 'landscaping',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Concrete, Excavation & Landscaping Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(`/services/${s.slug}/`) },
      })),
    },
  };
  if (site.trust.licenseNumber && !/#/.test(site.trust.licenseNumber)) {
    node.hasCredential = { '@type': 'EducationalOccupationalCredential', credentialCategory: 'PA Home Improvement Contractor', identifier: site.trust.licenseNumber.trim() };
  }
  return node;
}

export const websiteNode = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: abs('/'),
  name: site.name,
  publisher: { '@id': BUSINESS_ID },
  inLanguage: 'en-US',
});

export const breadcrumbNode = (trail) => ({
  '@type': 'BreadcrumbList',
  '@id': abs(trail[trail.length - 1].url || '/') + '#breadcrumb',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: abs(c.url),
  })),
});

export const webPageNode = ({ path, title, description, trail, type = 'WebPage' }) => ({
  '@type': type,
  '@id': abs(path) + '#webpage',
  url: abs(path),
  name: title,
  description,
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': BUSINESS_ID },
  inLanguage: 'en-US',
  ...(trail ? { breadcrumb: { '@id': abs(trail[trail.length - 1].url || path) + '#breadcrumb' } } : {}),
});

export const faqNode = (faqs, path) => ({
  '@type': 'FAQPage',
  '@id': abs(path) + '#faq',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const serviceNode = (service) => ({
  '@type': 'Service',
  '@id': abs(`/services/${service.slug}/`) + '#service',
  name: service.name,
  serviceType: service.name,
  description: service.metaDescription,
  url: abs(`/services/${service.slug}/`),
  provider: { '@id': BUSINESS_ID },
  areaServed: cities.map((c) => ({ '@type': 'City', name: c.name })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: `${service.name} options`,
    itemListElement: service.bullets.slice(0, 8).map((b) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: b },
    })),
  },
});

export const cityServiceNode = (city) => ({
  '@type': 'Service',
  '@id': abs(`/service-areas/${city.slug}/`) + '#service',
  name: `Concrete, Excavation & Landscaping in ${city.full}`,
  description: city.metaDescription,
  provider: { '@id': BUSINESS_ID },
  areaServed: {
    '@type': 'City',
    name: city.name,
    address: { '@type': 'PostalAddress', addressLocality: city.name, addressRegion: site.state, addressCountry: site.country },
  },
});

export const itemListNode = (path, name, items) => ({
  '@type': 'ItemList',
  '@id': abs(path) + '#list',
  name,
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
    url: abs(it.url),
  })),
});

/** Wraps nodes into one @graph block. */
export const graph = (nodes) =>
  `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) })
    .replace(/</g, '\\u003c')}</script>`;

export { abs, additional };
