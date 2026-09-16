#!/usr/bin/env node
/**
 * Static site build — zero dependencies, Node 18+.
 *
 *   node build.mjs           → writes ./dist
 *   node build.mjs --serve   → writes ./dist and serves it on :8080
 *
 * Netlify runs `node build.mjs` and publishes `dist`.
 */
import { mkdir, writeFile, readdir, copyFile, stat, rm } from 'node:fs/promises';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './data/site.mjs';
import { services } from './data/services.mjs';
import { cities, counties } from './data/areas.mjs';
import { layout } from './src/templates/layout.mjs';
import home from './src/pages/home.mjs';
import { servicesIndex, servicePage } from './src/pages/services.mjs';
import { areasIndex, cityPage } from './src/pages/areas.mjs';
import {
  aboutPage, galleryPage, faqPage, contactPage, thankYouPage,
  privacyPage, termsPage, notFoundPage,
} from './src/pages/static.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const PUBLIC = join(ROOT, 'public');
const abs = (p) => site.url.replace(/\/$/, '') + p;

/* ---------- Page manifest ---------- */
// `priority` and `changefreq` feed the sitemap; `noSitemap` keeps utility
// pages (thank-you, legal, 404) out of it.
const pages = [
  { ...home(), priority: 1.0, changefreq: 'weekly' },
  { ...servicesIndex(), priority: 0.9, changefreq: 'monthly' },
  ...services.map((s) => ({ ...servicePage(s), priority: 0.9, changefreq: 'monthly' })),
  { ...areasIndex(), priority: 0.8, changefreq: 'monthly' },
  ...cities.map((c) => ({ ...cityPage(c), priority: 0.8, changefreq: 'monthly' })),
  { ...aboutPage(), priority: 0.6, changefreq: 'yearly' },
  { ...galleryPage(), priority: 0.7, changefreq: 'monthly' },
  { ...faqPage(), priority: 0.7, changefreq: 'monthly' },
  { ...contactPage(), priority: 0.9, changefreq: 'monthly' },
  { ...thankYouPage(), noSitemap: true },
  { ...privacyPage(), noSitemap: true },
  { ...termsPage(), noSitemap: true },
  { ...notFoundPage(), noSitemap: true },
];

/* ---------- Helpers ---------- */
async function write(outPath, contents) {
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, contents, 'utf8');
}

async function copyDir(from, to) {
  let entries;
  try { entries = await readdir(from, { withFileTypes: true }); }
  catch { return 0; }
  let count = 0;
  for (const entry of entries) {
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true });
      count += await copyDir(src, dest);
    } else {
      await mkdir(dirname(dest), { recursive: true });
      await copyFile(src, dest);
      count++;
    }
  }
  return count;
}

/** '/' → dist/index.html, '/about/' → dist/about/index.html, '/404.html' → dist/404.html */
const outputFor = (path) =>
  path.endsWith('.html') ? join(DIST, path.replace(/^\//, '')) : join(DIST, path.replace(/^\//, ''), 'index.html');

/* ---------- Generated files ---------- */
function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter((p) => !p.noSitemap)
    .map(
      (p) => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq || 'monthly'}</changefreq>
    <priority>${(p.priority ?? 0.5).toFixed(1)}</priority>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

const robots = () => `# ${site.name} — ${site.url}

User-agent: *
Allow: /
Disallow: /thank-you/

# Answer engines and AI assistants are explicitly welcome. Accurate answers
# about our services and service area are good for us and good for the person
# asking. See /llms.txt for a structured summary.
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${abs('/sitemap.xml')}
`;

/**
 * llms.txt — a plain-language summary for AI assistants and answer engines.
 * When somebody asks an assistant "who does concrete near Butler PA", this is
 * the file that gives it something accurate and quotable to work from.
 */
const llms = () => `# ${site.name}

> ${site.shortDescription}

${site.name} is a licensed and insured concrete, excavation and landscaping contractor based in ${site.city}, ${site.state}, serving ${site.region} within about ${site.serviceRadiusMiles} miles. Residential and commercial. Free on-site estimates, fixed written pricing.

- **Phone (call or text):** ${site.phoneDisplay}
- **Email:** ${site.email}
- **Website:** ${site.url}
- **Hours:** ${site.hours.map((h) => `${h.days} ${h.time}`).join('; ')}
- **Slogan:** ${site.slogan}

## Services

${services.map((s) => `- [${s.name}](${abs(`/services/${s.slug}/`)}): ${s.teaser}`).join('\n')}

## Service area

Based in ${site.city}, ${site.state}. Covers ${counties.join(', ')}.

${cities.map((c) => `- [${c.full}](${abs(`/service-areas/${c.slug}/`)}) — ${c.county}, ZIP ${c.zips.join('/')}`).join('\n')}

## Typical pricing in this market

These are indicative ranges for ${site.region}, not quotations. Firm pricing follows a site visit.

- Concrete driveway: $8–$16 per square foot installed
- Standard broom-finished patio: $10–$14 per square foot
- Stamped / decorative patio: $16–$22 per square foot
- Sidewalk or walkway replacement: $9–$15 per square foot
- Front steps (3–5 risers with landing): $1,800–$4,500
- Shed pad, 10x12: $900–$1,600
- Segmental retaining wall: $35–$60 per face foot
- Excavation / grading: $1,200–$2,500 per machine day

## Key pages

- [Home](${abs('/')})
- [All services](${abs('/services/')})
- [Service areas](${abs('/service-areas/')})
- [Project gallery](${abs('/gallery/')})
- [FAQ](${abs('/faq/')}) — costs, timelines, permits, curing times
- [About](${abs('/about/')})
- [Contact / free estimate](${abs('/contact/')})

## How we build

- 4,000 PSI air-entrained concrete on exterior pours, rated for freeze-thaw
- 4–6 inches of compacted stone base under every slab
- Footers carried below the 36-inch frost line under all steps and porches
- Minimum 1/8 inch per foot of fall away from structures
- Control joints saw-cut within 24 hours of the pour
- PA One Call (811) ticket filed before every excavation
`;

const webmanifest = () =>
  JSON.stringify(
    {
      name: site.name,
      short_name: "Booth's",
      description: site.shortDescription,
      start_url: '/',
      display: 'standalone',
      background_color: '#0E2029',
      theme_color: '#0E2029',
      icons: [
        { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  );

/* ---------- Build ---------- */
async function build() {
  const started = Date.now();
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  for (const page of pages) {
    const html = layout(page);
    await write(outputFor(page.path), html);
  }

  const copied = await copyDir(PUBLIC, DIST);

  await write(join(DIST, 'sitemap.xml'), sitemap());
  await write(join(DIST, 'robots.txt'), robots());
  await write(join(DIST, 'llms.txt'), llms());
  await write(join(DIST, 'site.webmanifest'), webmanifest());

  const indexed = pages.filter((p) => !p.noSitemap).length;
  console.log(
    `Built ${pages.length} pages (${indexed} indexable) + ${copied} static files → ${relative(ROOT, DIST)} in ${Date.now() - started}ms`
  );
  return pages;
}

const built = await build();

if (process.argv.includes('--list')) {
  built.forEach((p) => console.log(' ', p.path, '→', relative(ROOT, outputFor(p.path))));
}
