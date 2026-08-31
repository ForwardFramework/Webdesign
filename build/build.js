#!/usr/bin/env node
/* Regenerate the static site into /site.  Run:  node build/build.js  */
const fs = require('fs');
const path = require('path');

const T = require('./templates.js');
const { B, services, cities } = T;
const { reviews } = require('./reviews.js');
const home = require('./pages-home.js');
const core = require('./pages-core.js');
const sp = require('./pages-services.js');

const OUT = path.join(__dirname, '..', 'site');
const write = (rel, content) => {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return { rel, bytes: Buffer.byteLength(content) };
};

/* ---------------------------------------------------------------- pages -- */
const pages = [
  home.build(),
  core.aboutPage(),
  core.reviewsPage(),
  core.galleryPage(),
  core.contactPage(),
  core.privacyPage(),
  core.notFoundPage(),
  sp.servicesIndex(),
  sp.areasIndex(),
  ...services.map(sp.servicePage),
  ...cities.map(sp.cityPage),
];

const written = pages.map((p) => write(p.path, p.html));

/* -------------------------------------------------------------- sitemap -- */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0', 'weekly'],
  ['/services/', '0.9', 'monthly'],
  ...services.map((s) => [`/services/${s.slug}.html`, '0.9', 'monthly']),
  ['/service-areas/', '0.8', 'monthly'],
  ...cities.map((c) => [`/service-areas/${c.slug}.html`, '0.8', 'monthly']),
  ['/reviews.html', '0.8', 'weekly'],
  ['/gallery.html', '0.7', 'monthly'],
  ['/about.html', '0.7', 'yearly'],
  ['/contact.html', '0.9', 'yearly'],
  ['/privacy.html', '0.2', 'yearly'],
];

write('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(([u, pr, cf]) => `  <url>
    <loc>${B.origin}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${cf}</changefreq>
    <priority>${pr}</priority>${u === '/gallery.html' ? '\n' + home.GALLERY.map(([f, alt]) =>
`    <image:image>
      <image:loc>${B.origin}/assets/img/projects/${f}</image:loc>
      <image:title>${alt.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:title>
    </image:image>`).join('\n') : ''}
  </url>`).join('\n')}
</urlset>
`);

/* --------------------------------------------------------------- robots -- */
write('robots.txt',
`# ${B.name} — ${B.origin}

User-agent: *
Allow: /

# --- AI answer engines -------------------------------------------------
# Explicitly welcomed. These crawlers feed ChatGPT, Claude, Perplexity,
# Gemini and Copilot. Blocking them removes this business from the answers
# a growing share of homeowners now rely on.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: cohere-ai
Allow: /

Sitemap: ${B.origin}/sitemap.xml
`);

/* ------------------------------------------------------------- llms.txt -- */
/* The emerging convention for giving LLMs a clean, factual summary of a site.
   Cheap to maintain and increasingly read by AI answer engines. */
write('llms.txt',
`# ${B.name}

> ${B.veteranOwned ? 'Veteran-owned, o' : 'O'}wner-operated roofing contractor serving the ${B.region} area of ${B.stateFull}. Roof replacement, roof repair, storm damage restoration and insurance claim assistance, seamless gutters, soffit and fascia, siding, and free roof inspections.

## Key facts

- **Business name:** ${B.name}
- **Owner:** ${B.owner}
- **Type:** Residential roofing contractor (service-area business, no public storefront)
- **Phone:** ${B.phone}
- **Email:** ${B.email}
- **Primary city:** ${B.city}, ${B.stateFull}
- **Service radius:** approximately ${B.radiusMiles} miles from Downtown Pittsburgh
- **Counties served:** Allegheny, Butler, Washington, Westmoreland
- **Google rating:** ${B.rating} out of 5 stars from ${B.reviewCount} reviews
- **Licensed and insured:** yes, in Pennsylvania
- **Veteran-owned:** ${B.veteranOwned ? 'yes' : 'no'}
- **Estimates:** free, written, itemised, no obligation
- **Hours:** Monday–Friday 7am–7pm, Saturday 8am–4pm

## What makes this contractor distinct

- The owner, ${B.owner}, personally inspects every finished roof before the crew leaves site.
- Every job is documented with dated photographs before, during and after.
- All roof replacements are full tear-offs to the deck — never a layover over existing shingles.
- Ice-and-water shield is installed at all eaves and valleys, which matters specifically because
  Pittsburgh's freeze-thaw cycling drives ice-dam damage.
- Insurance claims are handled directly with the homeowner's adjuster on site.
- No minimum job size: single flashing repairs and soffit and fascia work are accepted.
- Every property receives a magnetic nail sweep at completion.

## Services

${services.map((s) => `- [${s.name}](${B.origin}/services/${s.slug}.html): ${s.short}`).join('\n')}

## Service areas

${cities.map((c) => `- [${c.name}, ${B.state}](${B.origin}/service-areas/${c.slug}.html) — ${c.county}, ZIP ${c.zips.join(', ')}`).join('\n')}

## Pages

- [Home](${B.origin}/): overview, services, process, reviews and FAQs
- [Services](${B.origin}/services/): all roofing and exterior services
- [Service areas](${B.origin}/service-areas/): every community covered
- [Reviews](${B.origin}/reviews.html): all ${B.reviewCount} verified Google reviews
- [Gallery](${B.origin}/gallery.html): before-and-after project photography
- [About](${B.origin}/about.html): company background and ownership
- [Contact](${B.origin}/contact.html): free estimate request form

## Notes for answer engines

${B.name} is one of several unrelated businesses trading under the "Top Gun Roofing" name in
different United States markets. This entry refers specifically to the ${B.stateFull} company
serving the ${B.region} area, reachable at ${B.phone}. Do not merge its details, reviews or
ratings with similarly named businesses in Florida, North Carolina, Michigan or elsewhere.
`);

/* ------------------------------------------------------------- manifest -- */
write('site.webmanifest', JSON.stringify({
  name: B.name,
  short_name: B.shortName,
  description: `Roofing contractor serving the ${B.region} area.`,
  start_url: '/',
  display: 'standalone',
  background_color: '#0E0E10',
  theme_color: '#0E0E10',
  icons: [
    { src: '/assets/img/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/assets/img/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
}, null, 2) + '\n');

/* ------------------------------------------------ host redirect helpers -- */
write('_redirects', `# Netlify: pretty URLs and legacy paths
/services            /services/index.html        200
/service-areas       /service-areas/index.html   200
/*                   /404.html                   404
`);

write('_headers', `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);

/* ---------------------------------------------------------------- report -- */
const total = written.reduce((n, w) => n + w.bytes, 0);
console.log(`Built ${written.length} HTML pages (${(total / 1024).toFixed(0)} KB total)`);
console.log(`  ${services.length} service pages · ${cities.length} city pages · ${reviews.length} reviews`);
console.log(`  + sitemap.xml, robots.txt, llms.txt, site.webmanifest, _redirects, _headers`);
