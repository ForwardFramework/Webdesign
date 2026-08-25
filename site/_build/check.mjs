/* Structural sanity checks over the generated pages. Run: node _build/check.mjs */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);
const errors = [];
const warn = [];
const pages = readdirSync(ROOT).filter(f => f.endsWith('.html'));
const css = readFileSync(join(ROOT, 'assets/css/styles.css'), 'utf8');

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const at = m => `${page}: ${m}`;

  // --- tag balance (skips void elements, comments and inline script/JSON) ---
  const body = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/g, '');
  const stack = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/?)>/g;
  let m;
  while ((m = tagRe.exec(body))) {
    const [, closing, name, selfClose] = m;
    const tag = name.toLowerCase();
    if (VOID.has(tag) || selfClose === '/' || tag === '!doctype') continue;
    if (closing) {
      if (stack[stack.length - 1] === tag) stack.pop();
      else errors.push(at(`mismatched </${tag}> (open: ${stack[stack.length - 1] || 'none'})`));
    } else stack.push(tag);
  }
  if (stack.length) errors.push(at(`unclosed tags: ${stack.join(', ')}`));

  // --- duplicate ids ---
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(x => x[1]);
  ids.filter((v, i) => ids.indexOf(v) !== i).forEach(d => errors.push(at(`duplicate id "${d}"`)));

  // --- aria-describedby / for targets exist ---
  for (const [, ref] of html.matchAll(/aria-(?:describedby|controls|labelledby)="([^"]+)"/g)) {
    ref.split(/\s+/).forEach(r => { if (!ids.includes(r)) errors.push(at(`aria ref "${r}" has no element`)); });
  }
  for (const [, ref] of html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)) {
    if (!ids.includes(ref)) errors.push(at(`label for="${ref}" has no field`));
  }

  // --- every form control has a label ---
  for (const [, tag, attrs] of html.matchAll(/<(input|select|textarea)([^>]*)>/g)) {
    const id = (attrs.match(/\sid="([^"]+)"/) || [])[1];
    if (!id) { errors.push(at(`<${tag}> without id`)); continue; }
    if (!html.includes(`for="${id}"`)) errors.push(at(`<${tag} id="${id}"> has no label`));
  }

  // --- links and assets resolve ---
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    const [path, hash] = href.split('#');
    if (path && !existsSync(join(ROOT, path))) errors.push(at(`missing file: ${path}`));
    if (hash) {
      const target = path ? readFileSync(join(ROOT, path), 'utf8') : html;
      if (!target.includes(`id="${hash}"`)) errors.push(at(`dead anchor: ${href}`));
    }
  }

  // --- images carry alt, decorative svg is hidden ---
  for (const [full] of html.matchAll(/<img[^>]*>/g)) {
    if (!/\salt=/.test(full)) errors.push(at(`<img> without alt: ${full.slice(0, 70)}`));
  }
  for (const [full] of html.matchAll(/<svg[^>]*>/g)) {
    if (!/aria-hidden|role="img"/.test(full)) warn.push(at(`<svg> neither aria-hidden nor role=img`));
  }

  // --- head essentials ---
  ['<title>', 'name="description"', 'rel="canonical"', 'viewport'].forEach(t => {
    if (!html.includes(t)) errors.push(at(`missing ${t}`));
  });
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(at(`expected exactly one <h1>, found ${h1}`));

  // --- classes referenced in markup exist in the stylesheet ---
  const used = new Set();
  for (const [, list] of html.matchAll(/\sclass="([^"]+)"/g)) list.split(/\s+/).forEach(c => c && used.add(c));
  [...used].filter(c => !css.includes('.' + c)).forEach(c => warn.push(at(`class "${c}" not in stylesheet`)));
}

// --- JSON-LD parses ---
const idx = readFileSync(join(ROOT, 'index.html'), 'utf8');
const ld = idx.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!ld) errors.push('index.html: no JSON-LD block');
else { try { JSON.parse(ld[1]); } catch (e) { errors.push('index.html: JSON-LD invalid — ' + e.message); } }

warn.forEach(w => console.log('WARN ', w));
errors.forEach(e => console.log('ERROR', e));
console.log(`\n${pages.length} pages | ${errors.length} errors | ${warn.length} warnings`);
process.exit(errors.length ? 1 : 0);
