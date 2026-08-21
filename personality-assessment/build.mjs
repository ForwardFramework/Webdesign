/* ==========================================================================
   Forward Framework Personality Assessment — single-file build
   --------------------------------------------------------------------------
   Bundles the landing page, the assessment and the report into one
   self-contained HTML file with no external requests except the webfont.
   The multi-file source stays the single source of truth: this script only
   inlines it and swaps page navigation for hash routes.

     node build.mjs        ->  dist/forward-framework-assessment.html

   Routes in the bundle:
     #/          landing page
     #/assess    take the assessment
     #/demo      sample report
     #r=<data>   a shared profile carried in the fragment
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const read = p => readFileSync(join(root, p), 'utf8');

/* --- Rewrite multi-page links to hash routes ----------------------------- */
const toRoutes = html => html
  .replace(/href="assessment\.html\?demo=1"/g, 'href="#/demo"')
  .replace(/href="assessment\.html"/g, 'href="#/assess"')
  .replace(/href="index\.html#/g, 'href="#')
  .replace(/href="index\.html"/g, 'href="#/"')
  .replace(/<li><a href="README\.md">Documentation<\/a><\/li>\s*/g, '');

/* --- Pull the pieces out of the source pages ----------------------------- */
const index = read('index.html');

const between = (src, startRe, endRe, what) => {
  const start = src.search(startRe);
  const end = src.search(endRe);
  if (start < 0 || end < 0) throw new Error(`could not locate ${what}`);
  return src.slice(start, end);
};

const header = between(index, /<div class="utility-bar">/, /<main id="main">/, 'utility bar + site header');
const landing = between(index, /<main id="main">/, /<footer class="site-footer">/, 'landing main');
const footer = between(index, /<footer class="site-footer">/, /<script>\s*document\.getElementById\('year'\)/, 'site footer');

const progressBar = between(read('assessment.html'), /<div class="progress-bar/, /<main class="app-main"/, 'progress bar');

/* --- Inline the stylesheets ---------------------------------------------- */
const css = ['assets/css/brand.css', 'assets/css/landing.css', 'assets/css/app.css']
  .map(f => `/* ===== ${f} ===== */\n${read(f)}`)
  .join('\n\n');

/* --- Inline the ES modules ----------------------------------------------
   Concatenated in dependency order inside one module scope, so the local
   import/export statements simply come out.
   ------------------------------------------------------------------------ */
const stripModuleSyntax = src => src
  .replace(/^import\s+[^;]*?from\s+'\.\/[^']+';\s*$/gm, '')
  .replace(/^export\s+(const|function|let)\s/gm, '$1 ')
  .replace(/^export\s+\{[^}]*\};\s*$/gm, '')
  .trim();

// The rewrite runs over the JS too: app.js renders anchors back to index.html
// from inside template strings.
const js = toRoutes(['assets/js/items.js', 'assets/js/scoring.js', 'assets/js/report.js', 'assets/js/app.js']
  .map(f => `/* ===== ${f} ===== */\n${stripModuleSyntax(read(f))}`)
  .join('\n\n'));

for (const leak of [/^\s*import\s/m, /^\s*export\s/m]) {
  if (leak.test(js)) throw new Error(`module syntax survived stripping: ${leak}`);
}

// Separate modules may each declare a helper of the same name; concatenated
// into one scope that is a fatal redeclaration, and it takes the whole page
// down silently. Catch it here rather than in a browser.
const declared = new Map();
for (const line of js.split('\n')) {
  const m = /^(?:const|let|function)\s+([A-Za-z_$][\w$]*)/.exec(line);
  if (!m) continue;
  if (declared.has(m[1])) {
    throw new Error(`duplicate top-level declaration "${m[1]}" — it must live in exactly one module`);
  }
  declared.set(m[1], true);
}

/* --- Compose ------------------------------------------------------------- */
const FAVICON = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'>"
  + "<rect width='200' height='200' fill='%230A0A0A'/>"
  + "<path fill='%23A99A8C' d='M78 34 L198 34 L164 68 L112 68 L112 112 L174 112 L140 146 L112 146 L112 200 L78 166 Z'/>"
  + "<path fill='%23FFFFFF' d='M0 0 L120 0 L86 34 L34 34 L34 78 L96 78 L62 112 L34 112 L34 200 L0 166 Z'/></svg>";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Forward Framework Personality Assessment</title>
<meta name="description" content="A hiring assessment built on the Big Five, DISC, the Hogan Personality Inventory, Predictive Index behavioural drives and the Caliper Profile. Seventy items in, one decision-grade profile out.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap">
<link rel="icon" href="${FAVICON}">
<style>
${css}

/* ===== single-file router ===== */
body.is-app .utility-bar { display: none; }
body.is-app #main { display: none; }
#view-app { display: none; }
body.is-app #view-app { display: block; }
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

${toRoutes(header)}
${toRoutes(progressBar)}
${toRoutes(landing)}

<div id="view-app">
  <main class="app-main" id="app">
    <div class="wrap">
      <div class="form-panel" style="max-width:800px;margin-inline:auto"><p class="lede">Loading the assessment…</p></div>
    </div>
  </main>
</div>

${toRoutes(footer)}

<script type="module">
${js}

/* ===== router =====
   boot() is re-entrant and resets its own state, so every route change
   re-enters the assessment cleanly. */
const landingView = document.getElementById('main');

function showLanding() {
  document.body.classList.remove('is-app');
  document.getElementById('progress').hidden = true;
  landingView.hidden = false;
  window.scrollTo(0, 0);
}

function showApp(mode) {
  document.body.classList.add('is-app');
  landingView.hidden = true;
  boot(mode);
  window.scrollTo(0, 0);
}

function route() {
  const h = location.hash;
  if (h.startsWith('#r=')) return showApp();
  if (h === '#/assess') return showApp('assess');
  if (h === '#/demo') return showApp('demo');
  if (h === '' || h === '#/' || h === '#') return showLanding();
  // Any other fragment is an in-page anchor on the landing view.
  showLanding();
  const target = document.querySelector(h);
  if (target) target.scrollIntoView();
}

window.addEventListener('hashchange', route);
route();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const siteHeader = document.querySelector('.site-header');
const onScroll = () => siteHeader.classList.toggle('is-stuck', window.scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
</script>
</body>
</html>
`;

mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist/forward-framework-assessment.html'), html);
console.log(`dist/forward-framework-assessment.html — ${(html.length / 1024).toFixed(1)} KB`);
