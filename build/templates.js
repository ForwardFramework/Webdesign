const { business: B, services } = require('./data.js');
const { cities } = require('./cities.js');
const { icons } = require('./icons.js');

/* --- helpers ------------------------------------------------------------- */
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* depth 0 = /site root, 1 = /site/services or /site/service-areas */
const rel = (depth) => (depth === 0 ? '' : '../');

const stars = (n = 5) =>
  `<span class="stars" role="img" aria-label="${n} out of 5 stars">${icons.star.repeat(n)}</span>`;

const initials = (name) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

/* --- structured data ----------------------------------------------------- */
const ORG_ID = `${B.origin}/#organization`;

function localBusinessSchema() {
  const { reviews } = require('./reviews.js');
  return {
    '@type': 'RoofingContractor',
    '@id': ORG_ID,
    name: B.name,
    alternateName: B.shortName,
    url: `${B.origin}/`,
    telephone: B.phoneRaw,
    email: B.email,
    image: `${B.origin}/assets/img/og-image.jpg`,
    logo: { '@type': 'ImageObject', url: `${B.origin}/assets/img/logo.png`, width: 512, height: 512 },
    description:
      `${B.name} is a ${B.veteranOwned ? 'veteran-owned, ' : ''}owner-operated roofing contractor serving the ${B.region} area. ` +
      'Services include roof replacement, roof repair, storm damage and insurance claim work, seamless gutters, soffit and fascia, siding, and free roof inspections.',
    slogan: B.tagline,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Check, Credit Card, Insurance Claim',
    foundingDate: B.founded,
    address: { '@type': 'PostalAddress', addressLocality: B.city, addressRegion: B.state, postalCode: B.postal, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng },
    areaServed: [
      { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng }, geoRadius: String(B.radiusMiles * 1609) },
      ...cities.map((c) => ({ '@type': 'City', name: `${c.name}, ${B.state}` })),
    ],
    serviceArea: { '@type': 'GeoCircle', geoMidpoint: { '@type': 'GeoCoordinates', latitude: B.lat, longitude: B.lng }, geoRadius: String(B.radiusMiles * 1609) },
    openingHoursSpecification: B.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.open, closes: h.close,
    })),
    sameAs: B.sameAs,
    knowsAbout: [
      'Roof replacement', 'Asphalt shingle roofing', 'Roof leak repair', 'Storm damage restoration',
      'Roof insurance claims', 'Ice dam prevention', 'Attic ventilation', 'Seamless gutter installation',
      'Soffit and fascia repair', 'Siding installation',
    ],
    aggregateRating: {
      '@type': 'AggregateRating', ratingValue: B.rating, bestRating: '5', worstRating: '1',
      reviewCount: String(B.reviewCount),
    },
    review: reviews.filter((r) => !r.truncated).slice(0, 10).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
      reviewBody: r.text,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog', name: 'Roofing & Exterior Services',
      itemListElement: services.map((sv) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: sv.name, description: sv.short, url: `${B.origin}/services/${sv.slug}.html` },
      })),
    },
    makesOffer: { '@type': 'Offer', name: 'Free roof inspection and written estimate', price: '0', priceCurrency: 'USD' },
    contactPoint: {
      '@type': 'ContactPoint', telephone: B.phoneRaw, contactType: 'customer service',
      email: B.email, areaServed: 'US-PA', availableLanguage: 'English',
    },
  };
}

function websiteSchema() {
  return {
    '@type': 'WebSite', '@id': `${B.origin}/#website`,
    url: `${B.origin}/`, name: B.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };
}

function breadcrumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.label,
      item: `${B.origin}${t.href}`,
    })),
  };
}

function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/* --- shared chrome ------------------------------------------------------- */
function head(o) {
  const r = rel(o.depth);
  const url = `${B.origin}${o.path}`;
  const graph = [localBusinessSchema(), websiteSchema(), ...(o.schema || [])];
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<meta name="author" content="${esc(B.name)}">
<meta name="geo.region" content="US-PA">
<meta name="geo.placename" content="Pittsburgh, Pennsylvania">
<meta name="geo.position" content="${B.lat};${B.lng}">
<meta name="ICBM" content="${B.lat}, ${B.lng}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(B.name)}">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${B.origin}/assets/img/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(B.name)} — roofing contractor serving the Pittsburgh area">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.title)}">
<meta name="twitter:description" content="${esc(o.desc)}">
<meta name="twitter:image" content="${B.origin}/assets/img/og-image.jpg">

<meta name="theme-color" content="#0E0E10">
<link rel="icon" href="${r}assets/img/logo.png" type="image/png">
<link rel="apple-touch-icon" href="${r}assets/img/icons/apple-touch-icon.png">
<link rel="manifest" href="${r}site.webmanifest">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&display=swap"></noscript>
<link rel="stylesheet" href="${r}assets/css/styles.css">
<script defer src="${r}assets/js/main.js"></script>

<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>`;
}

function header(depth) {
  const r = rel(depth);
  const svcLinks = services.map((s) =>
    `<li><a href="${r}services/${s.slug}.html">${esc(s.navName)}</a></li>`).join('\n            ');
  const areaLinks = cities.slice(0, 8).map((c) =>
    `<li><a href="${r}service-areas/${c.slug}.html">${esc(c.name)}</a></li>`).join('\n            ');
  return `<a class="skip-link" href="#main">Skip to main content</a>
<header class="header">
  <div class="container header__bar">
    <a class="brand" href="${r}index.html" aria-label="${esc(B.name)} — home">
      <img src="${r}assets/img/logo.png" alt="" width="52" height="52">
      <span class="brand__text">
        <span class="brand__name">Top <em>Gun</em> Roofing</span>
        <span class="brand__tag">Pittsburgh, PA</span>
      </span>
    </a>

    <nav id="primary-nav" class="nav" data-open="false" aria-label="Main">
      <a href="${r}index.html">Home</a>
      <span class="has-sub">
        <button type="button" aria-expanded="false" aria-controls="submenu-services">Services ${icons.chevronDown}</button>
        <ul class="submenu" id="submenu-services" data-open="false">
          <li><a href="${r}services/index.html"><strong>All Services</strong></a></li>
          ${svcLinks}
        </ul>
      </span>
      <span class="has-sub">
        <button type="button" aria-expanded="false" aria-controls="submenu-areas">Service Areas ${icons.chevronDown}</button>
        <ul class="submenu" id="submenu-areas" data-open="false">
          <li><a href="${r}service-areas/index.html"><strong>All Areas</strong></a></li>
          ${areaLinks}
        </ul>
      </span>
      <a href="${r}gallery.html">Gallery</a>
      <a href="${r}reviews.html">Reviews</a>
      <a href="${r}about.html">About</a>
      <a href="${r}contact.html">Contact</a>
    </nav>

    <div class="header__cta">
      <a class="header__phone" href="${B.phoneHref}" data-cta="header-call">
        ${icons.phone}<span>${esc(B.phone)}</span>
      </a>
      <a class="btn btn--primary" href="${r}contact.html">Free Estimate</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">
        <span class="sr-only">Menu</span>${icons.menu}${icons.close}
      </button>
    </div>
  </div>
</header>`;
}

function footer(depth) {
  const r = rel(depth);
  const year = new Date().getFullYear();
  const svcLinks = services.map((s) =>
    `<li><a href="${r}services/${s.slug}.html">${esc(s.name)}</a></li>`).join('\n        ');
  const areaLinks = cities.slice(0, 9).map((c) =>
    `<li><a href="${r}service-areas/${c.slug}.html">${esc(c.name)} Roofing</a></li>`).join('\n        ');
  return `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div class="footer__brand">
        <img src="${r}assets/img/logo.png" alt="${esc(B.name)} logo" width="62" height="62" loading="lazy">
        <p>${B.veteranOwned ? 'Veteran-owned and o' : 'O'}wner-operated roofing for the ${esc(B.region)} area. Every roof inspected by ${esc(B.owner)} himself before we call it finished.</p>
        <p class="badge">${icons.star} ${esc(B.rating)} from ${B.reviewCount} Google reviews</p>
      </div>

      <div>
        <h3>Services</h3>
        <ul>
        ${svcLinks}
        </ul>
      </div>

      <div>
        <h3>Service Areas</h3>
        <ul>
        ${areaLinks}
        <li><a href="${r}service-areas/index.html">See all areas</a></li>
        </ul>
      </div>

      <div>
        <h3>Contact</h3>
        <div class="footer__contact">
          <a href="${B.phoneHref}" data-cta="footer-call">${icons.phone}<span>${esc(B.phone)}</span></a>
          <a href="mailto:${B.email}">${icons.mail}<span>${esc(B.email)}</span></a>
          <span style="display:flex;gap:.75rem;align-items:flex-start">${icons.pin}<span>Serving ${esc(B.region)}<br>and surrounding counties</span></span>
          <span style="display:flex;gap:.75rem;align-items:flex-start">${icons.clock}<span>Mon–Fri 7am–7pm<br>Sat 8am–4pm</span></span>
        </div>
        <p style="margin-top:1rem"><a class="btn btn--primary" href="${r}contact.html">Get a Free Estimate</a></p>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; ${year} ${esc(B.name)}. All rights reserved. Licensed &amp; insured roofing contractor in ${esc(B.stateFull)}.</p>
      <nav aria-label="Footer">
        <a href="${r}index.html">Home</a>
        <a href="${r}services/index.html">Services</a>
        <a href="${r}service-areas/index.html">Areas</a>
        <a href="${r}reviews.html">Reviews</a>
        <a href="${r}gallery.html">Gallery</a>
        <a href="${r}contact.html">Contact</a>
        <a href="${r}privacy.html">Privacy</a>
      </nav>
    </div>
  </div>
</footer>

<div class="callbar">
  <a class="callbar__call" href="${B.phoneHref}" data-cta="sticky-call">${icons.phone} Call Now</a>
  <a class="callbar__quote" href="${r}contact.html" data-cta="sticky-quote">${icons.clipboard} Free Estimate</a>
</div>`;
}

function breadcrumbs(depth, trail) {
  const r = rel(depth);
  const items = trail.map((t, i) => {
    const last = i === trail.length - 1;
    const href = t.href === '/' ? `${r}index.html` : `${r}${t.href.replace(/^\//, '')}`;
    return last
      ? `<li><span aria-current="page">${esc(t.label)}</span></li>`
      : `<li><a href="${href}">${esc(t.label)}</a></li>`;
  }).join('\n      ');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">
  <div class="container">
    <ol>
      ${items}
    </ol>
  </div>
</nav>`;
}

/* --- reusable sections --------------------------------------------------- */
function ctaBand(depth, opts = {}) {
  const r = rel(depth);
  return `<section class="cta-band">
  <div class="container">
    <p class="eyebrow" style="justify-content:center">Free &amp; No Obligation</p>
    <h2>${esc(opts.heading || 'Ready for a Roof You Can Stop Thinking About?')}</h2>
    <p>${esc(opts.text || `Get a free, written, itemised estimate from ${B.owner} — no pressure, no hard sell, and an honest answer about whether you need a repair or a replacement.`)}</p>
    <div class="btn-row">
      <a class="btn btn--primary btn--lg" href="${B.phoneHref}" data-cta="cta-band-call">${icons.phone} Call ${esc(B.phone)}</a>
      <a class="btn btn--ghost-light btn--lg" href="${r}contact.html">Request Free Estimate ${icons.arrowRight}</a>
    </div>
  </div>
</section>`;
}

function trustBar() {
  const items = [
    [icons.medal, `${B.rating} Stars, ${B.reviewCount} Reviews`, 'Verified Google reviews'],
    [icons.shield, 'Licensed &amp; Insured', 'Fully covered in Pennsylvania'],
    [icons.handshake, `${B.veteranOwned ? 'Veteran-Owned' : 'Locally Owned'}`, `Owner-operated by ${B.owner}`],
    [icons.wallet, 'Free Written Estimates', 'Itemised, with no obligation'],
  ];
  return `<section class="trustbar">
  <div class="container trustbar__grid">
    ${items.map(([ic, t, sub]) => `<div class="trustbar__item">${ic}<span><strong>${t}</strong><span>${sub}</span></span></div>`).join('\n    ')}
  </div>
</section>`;
}

function faqSection(faqs, opts = {}) {
  return `<section class="section${opts.alt ? ' alt-section' : ''}" id="faq">
  <div class="container container--narrow">
    <div class="section-head section-head--center">
      <p class="eyebrow" style="justify-content:center">Questions</p>
      <h2>${esc(opts.heading || 'Frequently Asked Questions')}</h2>
      ${opts.sub ? `<p class="lead">${esc(opts.sub)}</p>` : ''}
    </div>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details>
        <summary>${esc(q)}</summary>
        <div class="faq__body"><p>${esc(a)}</p></div>
      </details>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

function quoteForm(depth, opts = {}) {
  const r = rel(depth);
  const svcOptions = services.map((s) => `<option value="${esc(s.name)}">${esc(s.name)}</option>`).join('\n            ');
  const cityOptions = cities.map((c) => `<option value="${esc(c.name)}">${esc(c.name)}</option>`).join('\n            ');
  return `<div class="quote-card" id="estimate">
  <h${opts.level || 2}>${esc(opts.heading || 'Get Your Free Estimate')}</h${opts.level || 2}>
  <p class="quote-card__note">${esc(opts.note || `Tell us what is going on and ${B.owner} will get back to you — usually the same day.`)}</p>

  <!-- FORM DELIVERY
       This form posts to Formspree so it works on any static host with no server.
       1. Create a free form at https://formspree.io and copy your form ID.
       2. Replace YOUR_FORM_ID in the action below.
       Deploying to Netlify instead? Delete the action/method attributes and add
       netlify + netlify-honeypot="company" to the opening form tag. -->
  <form data-validate action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
    <p class="form-status" role="status" aria-live="polite"></p>

    <div class="form-row">
      <div class="field">
        <label for="${opts.id || 'q'}-name">Name <span class="req" aria-hidden="true">*</span></label>
        <input id="${opts.id || 'q'}-name" name="name" type="text" autocomplete="name" required>
        <p class="field__error" role="alert"></p>
      </div>
      <div class="field">
        <label for="${opts.id || 'q'}-phone">Phone <span class="req" aria-hidden="true">*</span></label>
        <input id="${opts.id || 'q'}-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
        <p class="field__error" role="alert"></p>
      </div>
    </div>

    <div class="field">
      <label for="${opts.id || 'q'}-email">Email <span class="req" aria-hidden="true">*</span></label>
      <input id="${opts.id || 'q'}-email" name="email" type="email" autocomplete="email" required>
      <p class="field__error" role="alert"></p>
    </div>

    <div class="form-row">
      <div class="field">
        <label for="${opts.id || 'q'}-service">What do you need?</label>
        <select id="${opts.id || 'q'}-service" name="service">
          <option value="">Not sure yet</option>
          ${svcOptions}
        </select>
      </div>
      <div class="field">
        <label for="${opts.id || 'q'}-city">Your town</label>
        <select id="${opts.id || 'q'}-city" name="city">
          <option value="">Select…</option>
          ${cityOptions}
          <option value="Other">Somewhere else nearby</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label for="${opts.id || 'q'}-message">Tell us about the job</label>
      <textarea id="${opts.id || 'q'}-message" name="message" rows="4" placeholder="Leaking near the chimney, roof is about 20 years old, insurance claim after the last storm…"></textarea>
      <p class="field__hint">Photos help — you can text them to ${esc(B.phone)} after you send this.</p>
    </div>

    <!-- Honeypot: real people never see or fill this -->
    <div class="sr-only" aria-hidden="true">
      <label for="${opts.id || 'q'}-company">Company</label>
      <input id="${opts.id || 'q'}-company" name="company" type="text" tabindex="-1" autocomplete="off">
    </div>
    <input type="hidden" name="page_source" value="">
    <input type="hidden" name="_subject" value="New estimate request — topgunroofing.com">

    <button class="btn btn--primary btn--block btn--lg" type="submit">Get My Free Estimate</button>
    <p class="form-legal">No obligation. We never sell your information.<br>
      Prefer to talk? Call <a href="${B.phoneHref}" style="font-weight:700">${esc(B.phone)}</a>.</p>
  </form>
</div>`;
}

/* --- page shell ---------------------------------------------------------- */
function page(o) {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
${head(o)}
</head>
<body>
${header(o.depth)}
${o.crumbs ? breadcrumbs(o.depth, o.crumbs) : ''}
<main id="main">
${o.body}
</main>
${footer(o.depth)}
</body>
</html>`;
}

module.exports = {
  B, services, cities, icons, esc, rel, stars, initials,
  page, breadcrumbs, ctaBand, trustBar, faqSection, quoteForm,
  breadcrumbSchema, faqSchema, localBusinessSchema, ORG_ID,
};
