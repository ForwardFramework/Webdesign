/**
 * Build the fillable discovery questionnaire.
 *
 *   python3 tools/build_discovery_pdf.py          # writes dist/discovery-questions.json
 *   node tools/build_fillable_pdf.mjs             # -> dist/Forward-Framework-Discovery-Questionnaire.pdf
 *
 * A real AcroForm: every question becomes a text field, radio group or set of
 * checkboxes, so a client can type into it in any PDF reader, save, and email
 * it back. Printing it still works — the fields draw as ruled boxes.
 *
 * Questions come from dist/discovery-questions.json, which build_discovery_pdf.py
 * writes from the same DISCOVERY data the website renders. Nothing is retyped
 * here, so the PDF cannot ask something the site does not.
 *
 * Needs pdf-lib. It is a build-time dependency only — nothing ships to the site.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'dist', 'discovery-questions.json');
const OUT = path.join(ROOT, 'dist', 'Forward-Framework-Discovery-Questionnaire.pdf');
/* Also written into assets/ so the site can hand it out. It is a build product
   that lives in the repo on purpose: the Netlify build runs Python only, so it
   cannot regenerate this one. Re-run this script after changing any question. */
const SITE_COPY = path.join(ROOT, 'assets', 'docs', 'discovery-questionnaire.pdf');

/* ---- page geometry, in points ---- */
const W = 595.28, H = 841.89;
const ML = 46, MR = 46, MT = 56, MB = 52;
const COL = W - ML - MR;

/* ---- brand ---- */
const INK = rgb(0.09, 0.082, 0.071);
const SOFT = rgb(0.29, 0.267, 0.239);
const MUTED = rgb(0.42, 0.369, 0.322);
const TAUPE = rgb(0.663, 0.604, 0.549);
const LINE = rgb(0.84, 0.83, 0.82);
const BONE = rgb(0.937, 0.922, 0.902);

/* Standard-14 fonts are WinAnsi. Fold the typographic characters the copy uses
   into something that encodes, rather than letting the build throw on a dash. */
const FOLD = [
  [/—/g, '—'], [/–/g, '–'], [/[‘’]/g, "'"],
  [/[“”]/g, '"'], [/…/g, '...'], [/·/g, '·'],
  [/→/g, '->'], [/ /g, ' '],
];
function safe(t) {
  let s = String(t == null ? '' : t);
  for (const [re, to] of FOLD) s = s.replace(re, to);
  // Anything still outside WinAnsi would throw at draw time.
  return s.replace(/[^\x20-\x7E -ÿ–—·]/g, '');
}

const doc = await PDFDocument.create();
doc.setTitle('Forward Framework - Discovery Questionnaire');
doc.setSubject('Intake questionnaire');
doc.setCreator('Forward Framework');
doc.setProducer('Forward Framework');

const reg = await doc.embedFont(StandardFonts.Helvetica);
const bold = await doc.embedFont(StandardFonts.HelveticaBold);
const form = doc.getForm();

let page, y;
function newPage() {
  page = doc.addPage([W, H]);
  y = H - MT;
  return page;
}
function room(need) {
  if (y - need < MB) newPage();
}

function wrap(text, font, size, width) {
  const words = safe(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (font.widthOfTextAtSize(test, size) <= width) { line = test; }
    else { if (line) lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}

function text(t, { font = reg, size = 9.5, color = INK, x = ML, width = COL, lead = 1.4 } = {}) {
  const lines = wrap(t, font, size, width);
  for (const line of lines) {
    room(size * lead);
    y -= size * lead;
    page.drawText(line, { x, y, size, font, color });
  }
  return lines.length;
}

/* ---- cover ---------------------------------------------------------- */
const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const totalQ = data.reduce((n, q) =>
  n + q.sections.reduce((m, s) => m + s.questions.length, 0), 0);

newPage();
page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: BONE });
y = H - 64;
page.drawRectangle({ x: ML, y: y - 8, width: 30, height: 30, borderColor: INK, borderWidth: 1.2 });
page.drawText('FF', { x: ML + 5, y: y + 1, size: 14, font: bold, color: INK });
page.drawText('FORWARD', { x: ML + 40, y: y + 10, size: 11, font: reg, color: INK });
page.drawText('FRAMEWORK', { x: ML + 40, y: y - 1, size: 6, font: reg, color: MUTED });

y -= 120;
for (const line of ['Twenty minutes here', 'saves us both a', 'month of guessing.']) {
  page.drawText(line, { x: ML, y, size: 29, font: reg, color: INK });
  y -= 34;
}
y -= 16;
text('This is every question we would ask you on a discovery call, made fillable. Type straight into it, save, and email it back to hello@forward-framework.com - or print it and write on it.',
  { size: 11, color: SOFT, width: COL - 110, lead: 1.55 });
y -= 8;
text('Answer the first questionnaire if you are not yet sure which service you need; it covers all seven and tells us which is worth doing first. Answer a service questionnaire instead if you already know, and it ends with that service’s free deliverable.',
  { size: 11, color: SOFT, width: COL - 110, lead: 1.55 });

y -= 26;
page.drawLine({ start: { x: ML, y }, end: { x: W - MR, y }, color: LINE, thickness: 0.8 });
y -= 20;
page.drawText('CONTENTS', { x: ML, y, size: 7.5, font: bold, color: TAUPE });
y -= 16;
data.forEach((q, i) => {
  const n = String(i + 1).padStart(2, '0');
  page.drawText(n, { x: ML, y, size: 10, font: reg, color: TAUPE });
  page.drawText(safe(q.title), { x: ML + 26, y, size: 10, font: reg, color: INK });
  const qs = q.sections.reduce((m, s) => m + s.questions.length, 0);
  page.drawText(`${qs} questions`, { x: W - MR - 60, y, size: 8.5, font: reg, color: MUTED });
  y -= 10;
  page.drawText(safe(q.kicker), { x: ML + 26, y, size: 7.8, font: reg, color: MUTED });
  y -= 15;
  page.drawLine({ start: { x: ML, y: y + 5 }, end: { x: W - MR, y: y + 5 }, color: LINE, thickness: 0.5 });
});

y = MB + 14;
page.drawLine({ start: { x: ML, y: y + 14 }, end: { x: W - MR, y: y + 14 }, color: LINE, thickness: 0.8 });
page.drawText('Forward Framework  ·  hello@forward-framework.com  ·  (412) 463-2126',
  { x: ML, y, size: 8, font: reg, color: MUTED });
page.drawText(`${totalQ} questions across ${data.length} questionnaires`,
  { x: W - MR - 150, y, size: 8, font: reg, color: MUTED });

/* ---- fields --------------------------------------------------------- */
const FIELD_BG = rgb(0.985, 0.982, 0.978);

function textField(name, { height = 20, width = COL, multiline = false } = {}) {
  room(height + 6);
  y -= height;
  const f = form.createTextField(name);
  if (multiline) f.enableMultiline();
  f.addToPage(page, {
    x: ML, y, width, height,
    backgroundColor: FIELD_BG, borderColor: LINE, borderWidth: 0.8,
    font: reg, textColor: INK,
  });
  f.setFontSize(9.5);
  y -= 6;
}

function optionRows(name, options, kind) {
  const size = 9;
  const box = 9.5;
  const gapX = 14;
  const rows = [];
  let row = [], used = 0;
  for (const o of options) {
    const w = box + 5 + reg.widthOfTextAtSize(safe(o), size) + gapX;
    if (used + w > COL && row.length) { rows.push(row); row = []; used = 0; }
    row.push({ o, w });
    used += w;
  }
  if (row.length) rows.push(row);

  const group = kind === 'radio' ? form.createRadioGroup(name) : null;
  rows.forEach((r, ri) => {
    room(18);
    y -= 14;
    let x = ML;
    r.forEach(({ o, w }, oi) => {
      const rect = { x, y: y - 1.5, width: box, height: box };
      if (group) {
        group.addOptionToPage(safe(o), page, {
          ...rect, backgroundColor: FIELD_BG, borderColor: LINE, borderWidth: 0.8,
        });
      } else {
        const cb = form.createCheckBox(`${name}.${ri}_${oi}`);
        cb.addToPage(page, {
          ...rect, backgroundColor: FIELD_BG, borderColor: LINE, borderWidth: 0.8,
        });
      }
      page.drawText(safe(o), { x: x + box + 5, y, size, font: reg, color: SOFT });
      x += w;
    });
    y -= 4;
  });
}

/* ---- questionnaires ------------------------------------------------- */
for (const q of data) {
  newPage();

  page.drawText(safe(q.kicker).toUpperCase(), { x: ML, y, size: 7.5, font: bold, color: TAUPE });
  y -= 26;
  page.drawText(safe(q.title), { x: ML, y, size: 20, font: reg, color: INK });
  y -= 16;
  text(q.blurb, { size: 9.5, color: SOFT, width: COL - 60 });
  // text() leaves y on the last baseline, so clear a full line before drawing.
  y -= 16;
  const qs = q.sections.reduce((m, s) => m + s.questions.length, 0);
  page.drawText(`${qs} questions  ·  ${q.sections.length} sections  ·  answers to hello@forward-framework.com`,
    { x: ML, y, size: 8, font: reg, color: MUTED });
  y -= 10;
  page.drawLine({ start: { x: ML, y }, end: { x: W - MR, y }, color: INK, thickness: 1.4 });
  y -= 18;

  let n = 0;
  for (const sec of q.sections) {
    room(70);
    page.drawLine({ start: { x: ML, y: y + 8 }, end: { x: W - MR, y: y + 8 }, color: LINE, thickness: 0.8 });
    y -= 6;
    page.drawText(safe(sec.n), { x: ML, y, size: 15, font: reg, color: TAUPE });
    page.drawText(safe(sec.title), { x: ML + 34, y, size: 12, font: reg, color: INK });
    y -= 12;
    text(sec.lede, { x: ML + 34, width: COL - 34, size: 8.5, color: MUTED });
    y -= 8;
    const whyTop = y;
    const lines = text('Why we ask. ' + sec.why, { x: ML + 8, width: COL - 8, size: 8.5, color: SOFT });
    page.drawLine({
      start: { x: ML + 1, y: whyTop - 2 }, end: { x: ML + 1, y: y + 2 },
      color: TAUPE, thickness: 1.4,
    });
    y -= 12;

    for (const field of sec.questions) {
      n += 1;
      const id = `${q.id}.${field.id}`;
      const label = safe(field.label) + (field.required ? '  (required)' : '');
      room(46);
      // Number in the margin, label beside it.
      const labelTop = y;
      text(label, { x: ML + 20, width: COL - 20, size: 9.5, font: bold });
      page.drawText(String(n), { x: ML, y: labelTop - 9.5 * 1.4, size: 9, font: reg, color: TAUPE });
      if (field.hint) text(field.hint, { x: ML + 20, width: COL - 20, size: 8.2, color: MUTED });
      y -= 4;

      const t = field.type;
      if (t === 'radio' || t === 'select') optionRows(id, field.options, 'radio');
      else if (t === 'check') optionRows(id, field.options, 'check');
      else if (t === 'textarea') textField(id, { height: 46, multiline: true });
      else if (t === 'number') {
        const affix = field.prefix || field.suffix || '';
        textField(id, { height: 20, width: 150 });
        if (affix) page.drawText(safe(affix), { x: ML + 158, y: y + 12, size: 9, font: reg, color: MUTED });
      } else textField(id, { height: 20 });
      y -= 8;
    }
    y -= 6;
  }
}

/* ---- page footers --------------------------------------------------- */
const pages = doc.getPages();
pages.forEach((pg, i) => {
  if (i === 0) return;
  pg.drawText('Forward Framework — Discovery Questionnaire',
    { x: ML, y: 28, size: 7, font: reg, color: MUTED });
  pg.drawText(String(i + 1), { x: W - MR - 12, y: 28, size: 7, font: reg, color: MUTED });
});

form.updateFieldAppearances(reg);
const bytes = await doc.save();
fs.writeFileSync(OUT, bytes);
fs.mkdirSync(path.dirname(SITE_COPY), { recursive: true });
fs.writeFileSync(SITE_COPY, bytes);
const fields = form.getFields().length;
console.log(`wrote ${path.relative(ROOT, OUT)}`);
console.log(`  and ${path.relative(ROOT, SITE_COPY)} — ${pages.length} pages, ${fields} fillable fields, ${totalQ} questions`);
