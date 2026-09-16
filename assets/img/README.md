# Images

## Drop your real logo here

The header and footer currently draw the **CCC hexagon monogram as inline SVG**
and typeset "Coastal / CUSTOM CARTS" with webfonts, so the site looks complete
without any image files. To use your actual artwork instead:

1. Save your logo files here as:
   - `logo-primary.png` (or `.svg`) — the full horizontal palm-tree logo
   - `logo-monogram.svg` — already here as a recreated CCC hexagon; replace it
     with your real file if you have a vector version
2. In `partials/header.html` and `partials/footer.html`, replace the
   `<svg class="logo__mark">…</svg>` + `<span class="logo__text">…</span>`
   block with:
   ```html
   <img src="assets/img/logo-primary.png" alt="Coastal Custom Carts" width="220" height="64">
   ```
3. Run `python3 build.py` to regenerate the pages.

## Photography

### ⬅️ Add these two files

The site is already wired for your two cart photos. Save them here with these
**exact filenames** and they appear everywhere automatically — no code changes:

| Filename | Photo |
|---|---|
| `cart-4-seater.jpg` | The rose gold lifted 4-seater |
| `cart-6-seater.jpg` | The blue lifted 6-seater by the water |

They are used in six places:

- `index.html` — both fleet cards, plus the "acts like a neighbor" feature block
- `rentals.html` — both fleet cards
- `for-sale.html` — the "Full custom build" card (the rose gold one, as an
  example of your paint work)

**Until those files exist, nothing breaks.** Each photo sits on top of the line-art
illustration; `main.js` removes any image that fails to load, so the illustration
shows through instead of a broken-image icon.

**Sizing:** roughly 1200px wide, saved as JPEG or WebP under ~300 KB. The CSS
handles cropping (`object-fit: cover`) at every screen size, so exact dimensions
don't matter — but keep the cart roughly centred, since the card crop is 16:10
and the feature block is 4:3.

### Still worth adding

| Slot | File to add | Used on |
|---|---|---|
| Kelly & Zack, or a cart at delivery | `owners.jpg` | `about.html` |
| Social share card (1200×630) | `og-image.jpg` | every page's link preview |

To use one, add an `<img>` alongside the `<svg>` inside a `.split__media`, copying
the pattern already in `index.html`:

```html
<img data-photo src="assets/img/owners.jpg" alt="Kelly and Zack of Coastal Custom Carts" loading="lazy" decoding="async" width="1200" height="900">
```

The `data-photo` attribute is what enables the fallback behaviour.

**Tips:** shoot in the hour before sunset, get the cart against water, sand or
palms, and keep files under ~300 KB each.
