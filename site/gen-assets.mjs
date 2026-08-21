/**
 * Regenerates the favicon, app icons and Open Graph card from the brand tokens.
 * Run with `node gen-assets.mjs` from the site root after a brand change.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const BRAND = '#38b6ff';
const NAVY = '#04202f';
const NAVY_MID = '#062c42';

/** The logo mark, parameterised by artwork colour and knockout colour. */
const mark = (art, paper) => `
  <g fill="${art}">
    <path d="M172 26h18a5 5 0 0 1 5 5v37h-23V26Z"/>
    <path d="M130 10 252 88h-30.5L130 30.5 38.5 88H8L130 10Z"/>
    <rect x="52" y="80" width="17" height="116"/>
    <rect x="191" y="80" width="17" height="116"/>
    <rect x="52" y="179" width="156" height="17"/>
    <rect x="117" y="42" width="11" height="11" rx="2.5"/>
    <rect x="132" y="42" width="11" height="11" rx="2.5"/>
    <rect x="117" y="57" width="11" height="11" rx="2.5"/>
    <rect x="132" y="57" width="11" height="11" rx="2.5"/>
  </g>
  <circle cx="130" cy="140" r="59" fill="${art}"/>
  <circle cx="130" cy="140" r="53" fill="none" stroke="${paper}" stroke-width="2.6"/>
  <g transform="translate(130 140) scale(1.06) translate(-100 -110)"
     stroke="${paper}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M70 88c-7-2-13 1-15 7s0 11-2 16 -4 10-1 15 9 7 14 5 8-7 9-13"/>
    <path d="M62 97c-4 3-5 8-3 12"/><path d="M58 112c-3 3-3 8-1 11"/>
    <path d="M130 88c7-2 13 1 15 7s0 11 2 16 4 10 1 15 -9 7-14 5-8-7-9-13"/>
    <path d="M138 97c4 3 5 8 3 12"/><path d="M142 112c3 3 3 8 1 11"/>
    <path d="M88 74c-1-5 2-9 6-10"/><path d="M100 62c-4-1-7 2-7 6"/>
    <path d="M112 74c1-5-2-9-6-10"/><path d="M100 62c4-1 7 2 7 6"/>
    <path d="M94 65c-6 0-10 3-12 8 -6 0-10 4-10 9 -5 2-7 7-5 12 -4 3-5 8-2 12 -3 4-2 9 2 12 -2 5 1 10 6 11 -1 5 3 9 8 9 1 5 6 8 11 6 3 4 9 4 12 1 3 3 9 3 12-1 5 2 10-1 11-6 5 0 9-4 8-9 5-1 8-6 6-11 4-3 5-8 2-12 3-4 2-9-2-12 2-5 0-10-5-12 0-5-4-9-10-9 -2-5-6-8-12-8"/>
    <path d="M84 96c3-2 7-2 10 0"/><path d="M106 96c3-2 7-2 10 0"/>
    <circle cx="87" cy="106" r="4.6" fill="${paper}" stroke="none"/>
    <circle cx="113" cy="106" r="4.6" fill="${paper}" stroke="none"/>
    <path d="M95 114c2 3 8 3 10 0"/>
    <path d="M92.5 121c0-3 3.5-4.5 7.5-4.5s7.5 1.5 7.5 4.5c0 3.5-4 6.5-7.5 6.5s-7.5-3-7.5-6.5Z" fill="${paper}" stroke="none"/>
    <path d="M100 129v4"/>
    <path d="M95 133c2 4 8 4 10 0 -1-2-9-2-10 0Z" fill="${paper}" stroke="none"/>
    <path d="M86 128c-2 4-1 8 2 10"/><path d="M114 128c2 4 1 8-2 10"/>
    <path d="M92 142c3 3 13 3 16 0"/>
  </g>`;

// ── Favicon: white mark on a brand-blue tile, matching the supplied artwork ──
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 260">
  <rect width="260" height="260" rx="48" fill="${BRAND}"/>
  <g transform="translate(0 26)">${mark('#ffffff', BRAND)}</g>
</svg>`;
writeFileSync('public/favicon.svg', favicon);

for (const size of [192, 512]) {
  await sharp(Buffer.from(favicon)).resize(size, size).png().toFile(`public/icon-${size}.png`);
}
await sharp(Buffer.from(favicon)).resize(512, 512).png().toFile('public/logo.png');
await sharp(Buffer.from(favicon)).resize(180, 180).png().toFile('public/apple-touch-icon.png');

// ── Open Graph card ─────────────────────────────────────────────────────────
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#073a58"/>
      <stop offset="55%" stop-color="${NAVY_MID}"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <radialGradient id="glow" cx="14%" cy="0%" r="72%">
      <stop offset="0%" stop-color="${BRAND}" stop-opacity=".42"/>
      <stop offset="100%" stop-color="${BRAND}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="stripes" width="16" height="16" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
      <rect width="1.5" height="16" fill="#ffffff" opacity=".035"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#stripes)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect y="616" width="1200" height="14" fill="${BRAND}"/>

  <g transform="translate(76 58) scale(0.62)">${mark(BRAND, NAVY_MID)}</g>

  <text x="256" y="112" font-family="Helvetica,Arial,sans-serif" font-size="46" font-weight="bold"
        fill="#ffffff" letter-spacing="-1">TOP DOG</text>
  <text x="258" y="146" font-family="Helvetica,Arial,sans-serif" font-size="19"
        fill="#8ea6b8" letter-spacing="9">EXTERIORS</text>

  <text x="76" y="290" font-family="Helvetica,Arial,sans-serif" font-size="66" font-weight="bold"
        fill="#ffffff" letter-spacing="-2.4">Roofing, Decks &amp; Exteriors</text>
  <text x="76" y="368" font-family="Helvetica,Arial,sans-serif" font-size="66" font-weight="bold"
        fill="#ffffff" letter-spacing="-2.4">Done Once. Done Right.</text>

  <text x="76" y="428" font-family="Helvetica,Arial,sans-serif" font-size="26" fill="#bdd0dd">
    Veteran owned · Owens Corning Preferred Contractor · Greater Pittsburgh, PA
  </text>

  <g transform="translate(76 470)">
    <rect width="336" height="56" rx="10" fill="${BRAND}"/>
    <text x="168" y="36" font-family="Helvetica,Arial,sans-serif" font-size="23" font-weight="bold"
          fill="${NAVY}" text-anchor="middle">Free Instant Roof Quote</text>
  </g>
  <text x="444" y="508" font-family="Helvetica,Arial,sans-serif" font-size="31" font-weight="bold"
        fill="#ffffff">(412) 438-8364</text>

  <text x="76" y="574" font-family="Helvetica,Arial,sans-serif" font-size="20" fill="#64748b">
    5-Year Workmanship Warranty · BBB Accredited · PA193451 · topdogexteriors.com
  </text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-default.png');

console.log('brand assets regenerated');
