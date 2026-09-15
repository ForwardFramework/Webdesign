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

## Photography — the highest-impact upgrade

Every card and feature block currently shows a **line-art cart illustration on a
navy gradient**. These are intentional placeholders. Swapping in real photos of
your carts is the single biggest visual improvement you can make.

Where they go:

| Slot | File to add | Used on |
|---|---|---|
| Fleet card images | `cart-4-passenger.jpg`, `cart-6-passenger.jpg`, `cart-8-passenger.jpg` | `index.html`, `rentals.html` |
| Feature/split images | `island-cruising.jpg`, `custom-build.jpg`, `owners.jpg` | `index.html`, `about.html`, `for-sale.html` |
| Social share card | `og-image.jpg` (1200×630) | every page's link preview |

To use one, replace the `<svg>` inside a `.fleet-card__media` or `.split__media`
with:

```html
<img src="assets/img/cart-6-passenger.jpg" alt="Six-passenger street-legal golf cart" loading="lazy" width="800" height="500">
```

The CSS already handles `object-fit` and aspect ratio, so the image will crop
correctly at every screen size.

**Tips:** shoot in the hour before sunset, get the cart against water, sand or
palms, and save as WebP or compressed JPEG under ~300 KB each.
