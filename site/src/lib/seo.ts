import type { Metadata } from 'next';
import { site, agent, brokerage, show } from '@/config/site';
import { FAQS } from '@/data/faqs';

/**
 * SEO / AEO / GEO helpers.
 *
 *  SEO — classic crawl + rank: titles, canonicals, OG, sitemap, semantic HTML.
 *  AEO — answer engines (featured snippets, voice, AI Overviews): FAQPage +
 *        speakable markup, and answers written as a direct first sentence.
 *  GEO — generative engines (ChatGPT, Perplexity, Gemini): entity-dense,
 *        explicitly-dated, explicitly-sourced content plus /llms.txt. Generative
 *        systems weight verifiable, attributable material far more heavily than
 *        unsourced marketing prose, so the citation registry is an SEO asset as
 *        much as an honesty one.
 */

export const BASE = site.url.replace(/\/$/, '');

export function pageMeta({
  title,
  description,
  path,
  image,
  keywords,
  noIndex,
  type = 'website',
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = `${BASE}${path}`;
  const ogImage = image ?? `${BASE}/og/default.png`;
  const fullTitle = title.includes('Caitlin Hoffman') ? title : `${title} | ${site.shortName}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
        },
    openGraph: {
      type: type === 'profile' ? 'profile' : type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === 'article' ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
    other: {
      'geo.region': 'US-FL',
      'geo.placename': 'Lakewood Ranch, Florida',
      'geo.position': `${site.geo.lat};${site.geo.lng}`,
      ICBM: `${site.geo.lat}, ${site.geo.lng}`,
    },
  };
}

/* ────────────────────────────── JSON-LD builders ────────────────────────────── */

export const ORG_ID = `${BASE}/#realestateagent`;
export const WEBSITE_ID = `${BASE}/#website`;

export function realEstateAgentLd() {
  const phone = show(agent.phone);
  const email = show(agent.email);
  const street = show(brokerage.street);
  const city = show(brokerage.city);
  const zip = show(brokerage.zip);
  const firm = show(brokerage.registeredName, brokerage.tradeName);
  const license = show(agent.licenseNumber);

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': ORG_ID,
    name: agent.fullName,
    alternateName: `${agent.fullName}, REALTOR®`,
    description: agent.shortBio,
    url: BASE,
    image: `${BASE}${agent.headshot}`,
    ...(phone ? { telephone: phone } : {}),
    ...(email ? { email } : {}),
    ...(license ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Florida Real Estate License', identifier: license } } : {}),
    parentOrganization: { '@type': 'RealEstateAgent', name: firm, ...(brokerage.website ? { url: brokerage.website } : {}) },
    address: {
      '@type': 'PostalAddress',
      ...(street ? { streetAddress: street } : {}),
      addressLocality: city || 'Lakewood Ranch',
      addressRegion: 'FL',
      ...(zip ? { postalCode: zip } : {}),
      addressCountry: 'US',
    },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    areaServed: site.serviceAreas.map((a) => ({ '@type': 'Place', name: a })),
    knowsAbout: [
      'Lakewood Ranch real estate',
      'Lakewood Ranch villages',
      'CDD and HOA assessments',
      'New construction and builder incentives',
      'Florida relocation',
      'Sarasota and Manatee County housing',
    ],
    ...(Object.values(agent.social).some((s) => s && !s.startsWith('NEEDS_VERIFICATION'))
      ? { sameAs: Object.values(agent.social).filter((s) => s && !s.startsWith('NEEDS_VERIFICATION')) }
      : {}),
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: BASE,
    name: site.name,
    description: site.description,
    inLanguage: 'en-US',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/homes?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(items: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${BASE}${it.href}`,
    })),
  };
}

/** FAQPage markup — the main AEO surface. Pass ids to scope it to a page. */
export function faqLd(ids?: string[]) {
  const faqs = ids ? FAQS.filter((f) => ids.includes(f.id)) : FAQS;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function articleLd({
  title,
  description,
  path,
  published,
  modified,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${BASE}${path}`,
    datePublished: published,
    dateModified: modified,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}${path}` },
    /** Voice-assistant hint (AEO). */
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-speakable]'] },
  };
}

export function placeLd(p: { name: string; description?: string; lat: number; lng: number; city: string; address?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: p.name,
    ...(p.description ? { description: p.description } : {}),
    geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng },
    address: {
      '@type': 'PostalAddress',
      ...(p.address ? { streetAddress: p.address } : {}),
      addressLocality: p.city,
      addressRegion: 'FL',
      addressCountry: 'US',
    },
  };
}

export function itemListLd(name: string, items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${BASE}${it.url}`,
    })),
  };
}
