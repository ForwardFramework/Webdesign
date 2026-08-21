import { chromium } from 'playwright';
import { readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve dist/ relative to this file so the script works from any cwd.
const DIST = join(dirname(fileURLToPath(import.meta.url)), 'dist');

// Enumerate every built route from dist/
const routes = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry === 'index.html') {
      const r = '/' + relative(DIST, dir).replace(/\\/g, '/');
      routes.push(r === '/.' ? '/' : r);
    }
  }
})(DIST);
routes.sort();

const base = 'http://localhost:4321';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(15000);
// Google Fonts is unreachable from this sandbox; aborting the request keeps each
// navigation from stalling until the timeout.
await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());

const problems = [];
const internalLinks = new Set();

for (const route of routes) {
  const errors = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    // The font stylesheet is deliberately aborted above, and the CDN is blocked
    // by this sandbox's egress proxy either way — neither is a site defect.
    if (/ERR_FAILED|ERR_CONNECTION_RESET|fonts\.(googleapis|gstatic)/.test(t)) return;
    errors.push(t);
  });
  page.on('pageerror', (e) => errors.push('JS: ' + e.message));

  const res = await page.goto(base + route, { waitUntil: 'domcontentloaded' });
  if (!res || res.status() >= 400) problems.push(`${route}: HTTP ${res?.status()}`);

  const audit = await page.evaluate(() => {
    const out = { issues: [], links: [] };
    const push = (s) => out.issues.push(s);

    // ── Head / SEO ──────────────────────────────────────────────────────
    const title = document.title;
    if (!title) push('missing <title>');
    else if (title.length > 65) push(`title ${title.length} chars: "${title}"`);
    const desc = document.querySelector('meta[name="description"]')?.content ?? '';
    if (!desc) push('missing meta description');
    else if (desc.length > 165) push(`meta description ${desc.length} chars`);
    if (!document.querySelector('link[rel="canonical"]')) push('missing canonical');
    if (!document.querySelector('meta[property="og:image"]')) push('missing og:image');

    // ── Headings ────────────────────────────────────────────────────────
    const h1s = document.querySelectorAll('h1');
    if (h1s.length !== 1) push(`${h1s.length} h1 elements`);

    // ── Structured data parses ──────────────────────────────────────────
    document.querySelectorAll('script[type="application/ld+json"]').forEach((s, i) => {
      try { JSON.parse(s.textContent); } catch (e) { push(`ld+json #${i} invalid: ${e.message}`); }
    });

    // ── Images / icons ──────────────────────────────────────────────────
    document.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('alt')) push(`img without alt: ${img.src}`);
    });

    // ── Forms ───────────────────────────────────────────────────────────
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      if (el.type === 'hidden') return;
      const id = el.id;
      const labelled =
        (id && document.querySelector(`label[for="${CSS.escape(id)}"]`)) ||
        el.closest('label') ||
        el.getAttribute('aria-label') ||
        el.getAttribute('aria-labelledby');
      if (!labelled) push(`unlabelled field: ${el.name || el.type}`);
    });
    // Nested forms are silently dropped by the parser
    document.querySelectorAll('form form').forEach(() => push('nested <form>'));

    // ── Buttons/links with no accessible name ───────────────────────────
    document.querySelectorAll('a, button').forEach((el) => {
      const name = (el.textContent || '').trim() || el.getAttribute('aria-label') || '';
      if (!name) push(`${el.tagName.toLowerCase()} with no accessible name`);
    });


    // ── Text contrast (WCAG 2.2 AA: 4.5:1 body, 3:1 large text) ─────────
    const srgb = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
    const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);

    // Walks up for the first opaque painted background. Gradients matter here:
    // every dark section on this site paints with linear/radial-gradient, whose
    // computed backgroundColor is transparent — reading only backgroundColor
    // would report white behind white text on every hero.
    const effectiveBg = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.backgroundImage && cs.backgroundImage !== 'none') {
          const stops = cs.backgroundImage.match(/rgba?\([^)]+\)/g) || [];
          for (const stop of stops) {
            const c = parse(stop);
            if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
          }
        }
        const c = parse(cs.backgroundColor);
        if (c.length >= 3 && (c[3] === undefined || c[3] > 0.85)) return c.slice(0, 3);
      }
      return [255, 255, 255];
    };

    const seen = new Set();
    document.querySelectorAll('p, span, a, li, h1, h2, h3, h4, dt, dd, label, button, summary, td, th, cite, blockquote, input, select, textarea').forEach((el) => {
      // Only leaf-ish nodes with their own visible text.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      // Checkboxes and radios render no text, so contrast does not apply.
      const isField =
        ['SELECT', 'TEXTAREA'].includes(el.tagName) ||
        (el.tagName === 'INPUT' && !['checkbox', 'radio', 'hidden', 'submit', 'button'].includes(el.type));
      if (!own && !isField) return;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.3) return;

      const fg = parse(cs.color).slice(0, 3);
      if (fg.length < 3) return;
      const bg = effectiveBg(el);
      const L1 = lum(fg), L2 = lum(bg);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);

      const px = parseFloat(cs.fontSize);
      const bold = Number(cs.fontWeight) >= 700;
      const large = px >= 24 || (bold && px >= 18.66);
      const need = large ? 3 : 4.5;

      if (ratio < need - 0.05) {
        const key = `${el.tagName}.${(typeof el.className === 'string' ? el.className : '').slice(0, 40)}|${cs.color}`;
        if (seen.has(key)) return;
        seen.add(key);
        push(`contrast ${ratio.toFixed(2)}:1 (need ${need}) — <${el.tagName.toLowerCase()} class="${(typeof el.className === 'string' ? el.className : '').slice(0, 45)}"> ${cs.color} on rgb(${bg.join(',')})`);
      }
    });

    // ── Collect internal links ──────────────────────────────────────────
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (href.startsWith('/') && !href.startsWith('//')) out.links.push(href.split('#')[0]);
    });

    return out;
  });

  audit.links.forEach((l) => internalLinks.add(l));
  if (audit.issues.length) problems.push(`${route}:\n    - ${audit.issues.join('\n    - ')}`);
  if (errors.length) problems.push(`${route}: console ${JSON.stringify(errors)}`);

  // ── Horizontal overflow at mobile width ───────────────────────────────
  await page.setViewportSize({ width: 375, height: 800 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  if (overflow > 1) problems.push(`${route}: horizontal overflow ${overflow}px at 375w`);
  await page.setViewportSize({ width: 1280, height: 900 });
}

// ── Broken internal links ───────────────────────────────────────────────
const known = new Set(routes.map((r) => (r === '/' ? '/' : r)));
const extras = ['/sitemap-index.xml', '/llms.txt', '/robots.txt', '/api/lead'];
const broken = [...internalLinks].filter((l) => {
  const clean = l.replace(/\?.*$/, '').replace(/\/$/, '') || '/';
  return !known.has(clean) && !extras.includes(clean) && !extras.includes(l);
});
if (broken.length) problems.push(`BROKEN INTERNAL LINKS: ${[...new Set(broken)].join(', ')}`);

console.log(`Checked ${routes.length} routes.\n`);
console.log(problems.length ? problems.join('\n') : '✓ No problems found.');
await b.close();
