const { business: B, services, reviews, areas } = require('../data/site.js');
const { esc, jsonld, header, footer } = require('./layout.js');

const D = B.domain.replace(/\/$/, '');
const abs = (p) => D + (p.startsWith('/') ? p : '/' + p);

/* ---------- Organisation node: the entity every page points back to ------ */
const orgNode = {
  '@type': ['RoofingContractor', 'HomeAndConstructionBusiness', 'LocalBusiness'],
  '@id': D + '/#organization',
  name: B.name,
  legalName: B.legalName,
  url: D + '/',
  telephone: B.phone,
  email: B.email,
  image: abs('/assets/img/og-image.png'),
  logo: { '@type': 'ImageObject', url: abs('/assets/img/logo.png'), caption: B.name },
  description: `${B.name} is a licensed and insured roofing contractor serving ${B.city}, ${B.state} and surrounding counties with roof replacement, roof repair, storm damage restoration, gutters, siding, and commercial flat roofing.`,
  slogan: B.tagline,
  foundingDate: String(B.foundedYear),
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Check, Credit Card, Financing, Insurance Claim',
  address: {
    '@type': 'PostalAddress',
    ...(B.street ? { streetAddress: B.street } : {}),
    addressLocality: B.city,
    addressRegion: B.state,
    ...(B.zip ? { postalCode: B.zip } : {}),
    addressCountry: B.country
  },
  geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
  areaServed: [
    { '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
      geoRadius: String(B.serviceRadiusMiles * 1609) },
    ...areas.slice(0, 24).map(a => ({ '@type': 'City', name: `${a.name}, ${B.state}` }))
  ],
  openingHoursSpecification: B.hours.filter(h => !h.closed).map(h => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days, opens: h.opens, closes: h.closes
  })),
  sameAs: [B.facebook],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: B.ratingValue,
    reviewCount: B.reviewCount,
    bestRating: '5', worstRating: '1'
  },
  review: reviews.slice(0, 4).map(r => ({
    '@type': 'Review',
    reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5' },
    author: { '@type': 'Person', name: r.name },
    publisher: { '@type': 'Organization', name: r.source },
    reviewBody: r.text
  })),
  hasOfferCatalog: {
    '@type': 'OfferCatalog', name: 'Roofing & Exterior Services',
    itemListElement: services.map(s => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.blurb, url: abs(`/services/${s.slug}/`) }
    }))
  },
  knowsAbout: [
    'Asphalt shingle roof replacement', 'Roof leak repair', 'Hail and wind damage',
    'Homeowners insurance roof claims', 'Attic ventilation', 'Ice dam prevention',
    'Seamless aluminum gutters', 'Vinyl and fiber cement siding', 'TPO and EPDM commercial roofing'
  ],
  contactPoint: {
    '@type': 'ContactPoint', telephone: B.phone, contactType: 'customer service',
    areaServed: 'US-PA', availableLanguage: 'English'
  }
};

const websiteNode = {
  '@type': 'WebSite', '@id': D + '/#website', url: D + '/', name: B.name,
  publisher: { '@id': D + '/#organization' }, inLanguage: 'en-US'
};

/* ---------- page shell --------------------------------------------------- */
function page(o) {
  const url = abs(o.path === '/' ? '/' : o.path);
  const crumbs = o.crumbs || [];
  const graph = [orgNode, websiteNode, {
    '@type': o.pageType || 'WebPage',
    '@id': url + '#webpage',
    url, name: o.title, description: o.desc,
    isPartOf: { '@id': D + '/#website' },
    about: { '@id': D + '/#organization' },
    inLanguage: 'en-US',
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(o.image || '/assets/img/og-image.png') },
    ...(crumbs.length ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {})
  }];

  if (crumbs.length) graph.push({
    '@type': 'BreadcrumbList', '@id': url + '#breadcrumb',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: D + '/' }]
      .concat(crumbs.map((c, i) => ({
        '@type': 'ListItem', position: i + 2, name: c.label,
        ...(c.href ? { item: abs(c.href) } : {})
      })))
  });

  if (o.faqs && o.faqs.length) graph.push({
    '@type': 'FAQPage', '@id': url + '#faq',
    mainEntity: o.faqs.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  });

  (o.schema || []).forEach(n => graph.push(n));

  const crumbHtml = crumbs.length ? `
    <ol class="crumbs">
      <li><a href="/">Home</a></li>
      ${crumbs.map((c, i) => i === crumbs.length - 1
        ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
        : `<li><a href="${c.href}">${esc(c.label)}</a></li>`).join('')}
    </ol>` : '';

  return `<!doctype html>
<html lang="en-US">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${o.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}">
<meta name="theme-color" content="#0B0D10">
<meta name="author" content="${esc(B.name)}">
<meta name="geo.region" content="US-${B.state}">
<meta name="geo.placename" content="${esc(B.city)}">
<meta name="ICBM" content="${B.lat}, ${B.lng}">

<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${abs(o.image || '/assets/img/og-image.png')}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(B.name)} — ${esc(B.tagline)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${abs(o.image || '/assets/img/og-image.png')}">

<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/mark.svg">
<link rel="manifest" href="/site.webmanifest">

<link rel="preload" href="/assets/fonts/inter-latin-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-black-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/styles.css">
<script>document.documentElement.className+=' js';window.RRphoto=function(img){var f=img.closest('.shot');if(!f||f.classList.contains('shot--empty'))return;
f.classList.add('shot--empty');f.innerHTML='<div class="ph"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M9 20v-5h6v5"/></svg><b>Photo coming soon</b><span>'+(img.getAttribute('src')||'').replace(/^\\//,'')+'</span></div>'+(f.dataset.cat?'<figcaption>'+f.dataset.cat+'</figcaption>':'');};</script>
${jsonld({ '@context': 'https://schema.org', '@graph': graph })}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${header(o.path)}
<main id="main">
${o.head ? `<section class="page-head"><div class="wrap">${crumbHtml}${o.head}</div></section>` : ''}
${o.body}
</main>
${footer()}
<script>window.RR_CONFIG=${JSON.stringify({ phone: B.phone, formEndpoint: B.formEndpoint, base: '/' })};</script>
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}

module.exports = { page, abs, D, orgNode };
