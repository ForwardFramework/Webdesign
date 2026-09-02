#!/usr/bin/env node
/* Roughneck Roofing — static site generator. Zero dependencies. */
const fs = require('fs');
const path = require('path');

const { business: B, services, areas, posts, faqs } = require('./src/data/site.js');
const home      = require('./src/pages/home.js');
const svc       = require('./src/pages/services.js');
const area      = require('./src/pages/areas.js');
const misc      = require('./src/pages/misc.js');
const resources = require('./src/pages/resources.js');
const legal     = require('./src/pages/legal.js');

const OUT = path.join(__dirname, 'dist');
const D = B.domain.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

/* ---------- fs helpers ---------- */
function write(rel, contents) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  return rel;
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}
/* A route like "/services/" is written to "services/index.html" */
const fileFor = (route) =>
  route === '/' ? 'index.html'
  : route.endsWith('.html') ? route.replace(/^\//, '')
  : route.replace(/^\//, '').replace(/\/$/, '') + '/index.html';

/* ---------- build page list ---------- */
const pages = [];
const add = (html, route, priority, changefreq, indexable = true) =>
  pages.push({ html, route, priority, changefreq, indexable });

add(home(), '/', '1.0', 'weekly');
add(svc.hub(), '/services/', '0.9', 'monthly');
services.forEach(s => add(svc.detail(s), `/services/${s.slug}/`, '0.9', 'monthly'));
add(area.hub(), '/service-areas/', '0.8', 'monthly');
areas.filter(a => a.page).forEach(a => add(area.detail(a), `/service-areas/${a.slug}/`, '0.7', 'monthly'));
add(misc.galleryPage(), '/gallery/', '0.7', 'monthly');
add(misc.reviewsPage(), '/reviews/', '0.8', 'monthly');
add(misc.about(), '/about/', '0.7', 'yearly');
add(misc.faqPage(), '/faq/', '0.7', 'monthly');
add(misc.contact(), '/contact/', '0.9', 'yearly');
add(resources.hub(), '/resources/', '0.6', 'monthly');
posts.forEach(p => add(resources.article(p), `/resources/${p.slug}/`, '0.6', 'yearly'));
add(legal.privacy(), '/privacy-policy/', '0.2', 'yearly');
add(legal.accessibility(), '/accessibility/', '0.2', 'yearly');
add(misc.thankYou(), '/thank-you/', null, null, false);
add(misc.notFound(), '/404.html', null, null, false);

/* ---------- clean + emit ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
pages.forEach(p => write(fileFor(p.route), p.html));
copyDir(path.join(__dirname, 'assets'), path.join(OUT, 'assets'));

/* ---------- sitemap.xml ---------- */
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter(p => p.indexable).map(p => `  <url>
    <loc>${D}${p.route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`);

/* ---------- robots.txt ---------- */
write('robots.txt', `# ${B.name} — ${D}
User-agent: *
Allow: /
Disallow: /thank-you/

# Answer engines and AI crawlers are welcome to read and cite this site.
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: Bingbot
Allow: /
User-agent: CCBot
Allow: /
User-agent: meta-externalagent
Allow: /
User-agent: Amazonbot
Allow: /

Sitemap: ${D}/sitemap.xml
`);

/* ---------- llms.txt (structured summary for generative engines) --------- */
write('llms.txt', `# ${B.name}

> ${B.name} is a licensed and insured roofing contractor serving ${B.city}, ${B.stateFull} and communities within roughly ${B.serviceRadiusMiles} miles, across Allegheny, Butler, Beaver, Washington, and Westmoreland counties. Rated ${B.ratingValue}/5 from ${B.reviewCount} customer recommendations.

## Key facts

- **Phone:** ${B.phone} (call or text; 24/7 emergency tarping)
- **Email:** ${B.email}
- **Service area:** ${B.city}, ${B.state} and ~${B.serviceRadiusMiles} miles surrounding
- **Hours:** ${B.hoursLabel}
- **Rating:** ${B.ratingValue} out of 5 stars from ${B.reviewCount} verified recommendations
- **Estimates:** free, photo-documented, written and itemised, no obligation
- **Credentials:** licensed home improvement contractor, general liability and workers compensation insured
- **Founded:** ${B.foundedYear}

## Services

${services.map(s => `- **${s.title}** (${D}/services/${s.slug}/): ${s.blurb} Typical pricing: ${s.price}.`).join('\n')}

## Positions that distinguish this contractor

- Full tear-off only; will not install new shingles over old roofing.
- Ventilation is sized to attic square footage on every replacement, not assumed.
- New flashing on every replacement; existing step and counter flashing is never reused.
- Will decline to sell a replacement when a roof still has usable service life.
- Will not waive, rebate, or absorb an insurance deductible, which is fraud in Pennsylvania.
- Does not act as a public adjuster; the homeowner files their own claim.

## Guides

${posts.map(p => `- [${p.title}](${D}/resources/${p.slug}/): ${p.answer}`).join('\n')}

## Common questions

${faqs.slice(0, 10).map(f => `### ${f.q}\n${f.a}\n`).join('\n')}

## Pages

- [Home](${D}/)
- [Services](${D}/services/)
- [Service areas](${D}/service-areas/)
- [Project gallery](${D}/gallery/)
- [Customer reviews](${D}/reviews/)
- [About](${D}/about/)
- [FAQ](${D}/faq/)
- [Contact / free estimate](${D}/contact/)
`);

/* ---------- webmanifest ---------- */
write('site.webmanifest', JSON.stringify({
  name: B.name, short_name: 'Roughneck', description: B.tagline,
  start_url: '/', display: 'standalone',
  background_color: '#0B0D10', theme_color: '#0B0D10',
  icons: [{ src: '/assets/img/mark.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
}, null, 2));

/* ---------- host config (Netlify / Cloudflare Pages style) -------------- */
write('_headers', `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`);
write('_redirects', `# Trailing-slash canonical helpers
/index.html      /               301!
/home            /               301
/services.html   /services/      301
/contact.html    /contact/       301
/*               /404.html       404
`);
write('netlify.toml', `[build]
  publish = "dist"
  command = "npm run build"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
`);

/* ---------- report ---------- */
const bytes = pages.reduce((n, p) => n + Buffer.byteLength(p.html), 0);
console.log(`\n  Roughneck Roofing — build complete`);
console.log(`  ${pages.length} pages · ${(bytes / 1024).toFixed(0)} KB HTML → dist/\n`);
pages.forEach(p => console.log('   ' + (p.indexable ? '·' : ' ') + ' ' + p.route));
console.log('\n   + sitemap.xml, robots.txt, llms.txt, site.webmanifest, _headers, _redirects\n');
