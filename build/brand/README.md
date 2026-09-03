# Brand assets

Generates every logo and image asset the site uses.

```bash
node build/brand/export.js
```

## What it produces

Into `site/assets/img/`:

- `logo.png` — TG monogram badge, transparent (header, footer, favicon)
- `logo-full.png` — full "TOP GUN / ROOFING LLC" badge, transparent
- `icons/apple-touch-icon.png`, `icons/icon-192.png`, `icons/icon-512.png`
- `og-image.jpg` — 1200×630 social share card

## Files

| File | Purpose |
|---|---|
| `badge.py` | Draws the badge as SVG. `--mark` emits the monogram variant. |
| `export.js` | Renders the SVG in Chromium and writes the PNG/JPEG assets. |

`badge.py` prints SVG to stdout, so you can preview it directly:

```bash
python3 build/brand/badge.py > /tmp/badge.svg          # full badge
python3 build/brand/badge.py --mark > /tmp/mark.svg    # monogram
```

## Fonts

The export needs **Anton** and **Inter** installed on the machine, because the text is
rendered by the browser rather than converted to outlines:

```bash
mkdir -p ~/.fonts
curl -sL "https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm0K0.ttf" -o ~/.fonts/Anton-Regular.ttf
curl -sL "https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800" \
  | grep -o 'https://fonts.gstatic.com[^)]*' | head -1 | xargs curl -sL -o ~/.fonts/Inter.ttf
fc-cache -f
```

Also needs Playwright: `npm i playwright`.

## Note

This badge is a typographic interpretation using the brand's colours and shield shape.
It is **not** a reproduction of the illustrated eagle logo. When the real artwork is
available, overwrite the files in `site/assets/img/` directly and stop running this
script — see [`site/assets/img/README.md`](../../site/assets/img/README.md).
