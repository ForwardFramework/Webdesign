# Image assets

## Logo — current state

The files below hold a **vector badge built from the brand's colours and shapes**. It is
an on-brand stand-in, **not** the illustrated eagle logo. The eagle artwork could not be
extracted from the original conversation, so it was not reproduced — a hand-drawn
imitation of a trademark is worse than an honest placeholder.

There are two marks, which is deliberate:

| File | What it is | Used for |
|---|---|---|
| `logo.png` | **TG monogram** in the badge shield | Header, footer, favicon — anywhere the mark renders under ~120px |
| `logo-full.png` | **Full badge** with "TOP GUN / ROOFING LLC" | Social card, letterhead, yard signs, anything above ~120px |

The split exists because a wordmark inside a shield is unreadable at the 52px the site
header uses. The monogram stays crisp down to 32px; the full badge turns to mush.

### Dropping in the real logo

Overwrite these files, keeping the exact same names and paths — no HTML changes needed:

| File | What to put there | Size |
|---|---|---|
| `logo.png` | The eagle logo, **transparent background**, cropped tight | 512×512 or larger |
| `logo-full.png` | Same artwork, full lockup (delete if you only have one version) | 1024×1024 or larger |
| `icons/apple-touch-icon.png` | Logo on a solid `#0E0E10` square | 180×180 |
| `icons/icon-192.png` | Logo on solid `#0E0E10` | 192×192 |
| `icons/icon-512.png` | Logo on solid `#0E0E10` | 512×512 |
| `og-image.jpg` | Social share card — logo, tagline, phone number | 1200×630 |

If the eagle logo is detailed, crop it tight before using it at header size — trimming
the empty margin is what makes a small logo readable.

### Regenerating the current badge

```bash
node build/brand/export.js       # rewrites every file listed above
```

Requires the Anton and Inter fonts installed locally. See
[`build/brand/README.md`](../../../build/brand/README.md).

---

## Job photos — still placeholders

These hold branded placeholders. Replace them with the real aerial photos, **same
filenames**:

| File | What goes here | Size |
|---|---|---|
| `projects/aerial-tear-off-before.jpg` | Aerial **before**: weathered grey roof, dumpster in driveway | 1600×1200 |
| `projects/aerial-new-shingles-driftwood.jpg` | Aerial **after**: new driftwood/tan shingles, tear-off in progress | 1600×1200 |
| `projects/aerial-new-roof-chimneys.jpg` | Aerial finished grey roof, two brick chimneys, dormer | 1600×1200 |
| `projects/aerial-full-replacement-street.jpg` | Aerial finished roof, full house from the street | 1600×1200 |

`aerial-new-roof-chimneys.jpg` is also the home page hero background, so pick the
strongest image for that slot.

### Before uploading

1. **Resize** to the sizes above.
2. **Compress** with [Squoosh](https://squoosh.app). Target **under 250 KB** each — page
   speed is a direct ranking factor.
3. Optionally export `.webp` versions with the same base name; the gallery markup will
   pick them up.

### Adding more job photos

Drop files into `projects/`, add a card in `build/pages-home.js` (the `GALLERY` array
feeds both the home page and the gallery page), then run `node build/build.js`. Always
write descriptive, location-aware alt text — it feeds image search and AI answer engines.
