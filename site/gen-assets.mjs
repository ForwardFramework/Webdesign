/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BRAND ASSET PIPELINE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Source of truth: `brand/TDE_Logo.jpg` — the official lockup, white artwork on
 *  a solid #38b6ff field.
 *
 *  The artwork is strictly two-tone, so the white pixels ARE the artwork and the
 *  blue pixels are the ground. That lets us derive an alpha mask from
 *  "whiteness" and then paint that mask any colour we like:
 *
 *    • white  → for navy sections and the blue favicon tile
 *    • #38b6ff → for white pages (the header)
 *
 *  Note this inverts correctly by construction: the dog's line work and the
 *  badge ring are ground-coloured in the source, so they become transparent
 *  holes and pick up whatever the mark is sitting on — exactly as the original
 *  artwork intends.
 *
 *  Run `node gen-assets.mjs` after changing the source file.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'brand/TDE_Logo.jpg';
const OUT = 'public/brand';
mkdirSync(OUT, { recursive: true });

const BRAND = { r: 56, g: 182, b: 255 };
const NAVY = '#04202f';

/* ── 1. Alpha mask from whiteness ─────────────────────────────────────────
   The red channel separates the two tones best: 255 on artwork, 56 on ground.
   Everything between is antialiasing, which maps to partial alpha and keeps
   the edges smooth.                                                          */
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const alpha = Buffer.alloc(width * height);
for (let i = 0, p = 0; i < data.length; i += channels, p++) {
  const norm = (data[i] - BRAND.r) / (255 - BRAND.r);
  alpha[p] = Math.max(0, Math.min(255, Math.round(norm * 255)));
}

/** Content bounding box of the mask within a horizontal band. */
function bbox(y0, y1, threshold = 40) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < width; x++) {
      if (alpha[y * width + x] < threshold) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** The mask, tinted, cropped, and scaled to a target height.
 *
 *  The tint is written straight into an RGBA buffer rather than composited.
 *  `blend: 'dest-in'` reads the *alpha* of its overlay, and a 1-channel raw
 *  buffer has no alpha channel — sharp treats it as fully opaque and the mask
 *  is silently ignored, which yields a solid rectangle. Assembling the pixels
 *  by hand has no such trap.                                                 */
async function render(hex, crop, targetH) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const rgba = Buffer.alloc(width * height * 4);
  for (let p = 0; p < alpha.length; p++) {
    const o = p * 4;
    rgba[o] = r;
    rgba[o + 1] = g;
    rgba[o + 2] = b;
    rgba[o + 3] = alpha[p];
  }

  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract(crop)
    .resize({ height: targetH, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/* ── 2. Split the lockup ─────────────────────────────────────────────────
   The wordmark sits in the lower fifth; the house-and-badge above it. Finding
   the gap by scanning for empty rows keeps this correct if the artwork is ever
   re-exported at a different size.                                           */
let gapY = Math.round(height * 0.72);
for (let y = Math.round(height * 0.66); y < Math.round(height * 0.82); y++) {
  let rowHasInk = false;
  for (let x = 0; x < width; x++) {
    if (alpha[y * width + x] > 40) { rowHasInk = true; break; }
  }
  if (!rowHasInk) { gapY = y; break; }
}

const markBox = bbox(0, gapY);
const wordBox = bbox(gapY, height);
const fullBox = bbox(0, height);
console.log('mark', markBox, '\nword', wordBox, '\ngap at y =', gapY);

const pad = (b, n) => ({
  left: Math.max(0, b.left - n),
  top: Math.max(0, b.top - n),
  width: Math.min(width - Math.max(0, b.left - n), b.width + n * 2),
  height: Math.min(height - Math.max(0, b.top - n), b.height + n * 2),
});

const write = async (name, buf) => {
  await sharp(buf).toFile(`${OUT}/${name}`);
  console.log('  →', `${OUT}/${name}`);
};

const BLUE = '#38b6ff';
await write('mark-blue.png', await render(BLUE, pad(markBox, 4), 512));
await write('mark-white.png', await render('#ffffff', pad(markBox, 4), 512));
await write('word-blue.png', await render(BLUE, pad(wordBox, 4), 128));
await write('word-white.png', await render('#ffffff', pad(wordBox, 4), 128));
await write('lockup-blue.png', await render(BLUE, pad(fullBox, 8), 640));
await write('lockup-white.png', await render('#ffffff', pad(fullBox, 8), 640));

/* ── 3. Favicon and app icons: white mark on the brand tile ─────────────── */
const markWhite = await render('#ffffff', pad(markBox, 4), 760);
const tile = await sharp({
  create: { width: 1024, height: 1024, channels: 4, background: BRAND },
})
  .composite([{ input: markWhite, gravity: 'center' }])
  .png()
  .toBuffer();

for (const size of [192, 512]) {
  await sharp(tile).resize(size, size).png().toFile(`public/icon-${size}.png`);
}
await sharp(tile).resize(512, 512).png().toFile('public/logo.png');
await sharp(tile).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(tile).resize(64, 64).png().toFile('public/favicon.png');
console.log('  → app icons');

/* ── 4. Open Graph card ──────────────────────────────────────────────────── */
const ogLogo = await render(BLUE, pad(fullBox, 8), 300);

const ogBg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#073a58"/>
      <stop offset="55%" stop-color="#062c42"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="18%" r="62%">
      <stop offset="0%" stop-color="${BLUE}" stop-opacity=".34"/>
      <stop offset="100%" stop-color="${BLUE}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="stripes" width="16" height="16" patternTransform="rotate(135)" patternUnits="userSpaceOnUse">
      <rect width="1.5" height="16" fill="#ffffff" opacity=".035"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#stripes)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect y="616" width="1200" height="14" fill="${BLUE}"/>

  <text x="76" y="200" font-family="Helvetica,Arial,sans-serif" font-size="64" font-weight="bold"
        fill="#ffffff" letter-spacing="-2.4">Roofing, Decks &amp; Exteriors</text>
  <text x="76" y="276" font-family="Helvetica,Arial,sans-serif" font-size="64" font-weight="bold"
        fill="#ffffff" letter-spacing="-2.4">Done Once. Done Right.</text>
  <text x="76" y="336" font-family="Helvetica,Arial,sans-serif" font-size="25" fill="#bdd0dd">
    Veteran owned · Owens Corning Preferred Contractor · Greater Pittsburgh, PA
  </text>

  <g transform="translate(76 392)">
    <rect width="336" height="56" rx="10" fill="${BLUE}"/>
    <text x="168" y="36" font-family="Helvetica,Arial,sans-serif" font-size="23" font-weight="bold"
          fill="${NAVY}" text-anchor="middle">Free Instant Roof Quote</text>
  </g>
  <text x="444" y="430" font-family="Helvetica,Arial,sans-serif" font-size="31" font-weight="bold"
        fill="#ffffff">(412) 438-8364</text>

  <text x="76" y="530" font-family="Helvetica,Arial,sans-serif" font-size="20" fill="#8ea6b8">
    5★ Google &amp; Facebook · A Rating with the BBB · 5-Year Workmanship Warranty · PA193451
  </text>
</svg>`;

await sharp(Buffer.from(ogBg))
  .composite([{ input: ogLogo, top: 60, left: 830 }])
  .png()
  .toFile('public/og-default.png');
console.log('  → public/og-default.png');

console.log('brand assets regenerated');
