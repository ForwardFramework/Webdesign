#!/usr/bin/env node
/**
 * Downloads every generated image referenced in src/config/images.ts into
 * public/images/generated, so the site serves its own assets instead of a
 * third-party CDN.
 *
 *   npm run fetch:images
 *   echo 'NEXT_PUBLIC_USE_LOCAL_IMAGES=true' >> .env.local
 *
 * Run this from a machine with normal outbound internet access.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = await readFile(join(root, 'src/config/images.ts'), 'utf8');

const entries = [...manifest.matchAll(/local:\s*'([^']+)',\s*\n\s*remote:\s*'([^']*)'/g)]
  .map(([, local, remote]) => ({ local, remote }))
  .filter((e) => e.remote);

if (!entries.length) {
  console.error('No remote image URLs found in src/config/images.ts — nothing to fetch.');
  process.exit(1);
}

console.log(`Fetching ${entries.length} images…\n`);
let ok = 0;
let failed = 0;

for (const { local, remote } of entries) {
  const dest = join(root, 'public', local);
  try {
    const res = await fetch(remote);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`  ✓ ${local}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok += 1;
  } catch (err) {
    console.error(`  ✗ ${local}  — ${err.message}`);
    failed += 1;
  }
}

console.log(`\nDone: ${ok} saved, ${failed} failed.`);
if (ok > 0) {
  console.log("\nNow add this to .env.local so the site serves your own copies:\n  NEXT_PUBLIC_USE_LOCAL_IMAGES=true\n");
}
process.exit(failed && !ok ? 1 : 0);
