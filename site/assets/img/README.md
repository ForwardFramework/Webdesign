# Image assets — drop-in guide

Every file listed below currently holds a **branded placeholder** (dark charcoal + gold).
The real images could not be written automatically, so replace each file **keeping the exact
same filename and path** — no HTML changes are needed afterward.

## Required replacements

| File | What goes here | Recommended size |
|---|---|---|
| `logo.png` | The Top Gun Roofing eagle/shield logo, **transparent background** | 512×512 (square, PNG-24) |
| `icons/apple-touch-icon.png` | Logo on a solid `#0E0E10` square (iOS home screen) | 180×180 |
| `icons/icon-192.png` | Logo on solid `#0E0E10` | 192×192 |
| `icons/icon-512.png` | Logo on solid `#0E0E10` | 512×512 |
| `og-image.jpg` | Social share card — best finished roof + logo + phone number | 1200×630 |
| `projects/aerial-tear-off-before.jpg` | Aerial **before** shot: weathered grey roof, dumpster in driveway | 1600×1200 |
| `projects/aerial-new-shingles-driftwood.jpg` | Aerial **after** shot: new driftwood/tan shingles, tear-off in progress | 1600×1200 |
| `projects/aerial-new-roof-chimneys.jpg` | Aerial finished grey roof, two brick chimneys, dormer | 1600×1200 |
| `projects/aerial-full-replacement-street.jpg` | Aerial finished roof, full house from the street side | 1600×1200 |

## Before you upload

1. **Resize** to the sizes above. The aerial photos are wider than they need to be at
   full resolution and will slow the page down otherwise.
2. **Compress** with [Squoosh](https://squoosh.app) or `cwebp`. Target **under 250 KB**
   per photo — page speed is a direct Google ranking factor.
3. Optionally also export `.webp` versions with the same base name; the markup already
   uses `<picture>` on the gallery, so `aerial-tear-off-before.webp` will be picked up
   automatically if present.
4. Keep the logo's **transparent background** — it sits on both dark and light panels.

## Adding more job photos

Drop new files into `projects/`, then add a matching card in `gallery.html` and a
`<url>` entry in `sitemap.xml`. Always write a descriptive, location-aware `alt`
attribute (e.g. `alt="New architectural shingle roof installed in Mt. Lebanon, PA"`) —
descriptive alt text feeds both image search and AI answer engines.
