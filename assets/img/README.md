# Image assets

## logo.png  ← ADD THIS FILE

Drop the official Roughneck Roofing logo here, named exactly **`logo.png`**
(transparent PNG, at least 1200px wide, or `logo.svg` if you have vector).

Every page loads `assets/img/logo.png` in the header and footer. Until that file
exists, the site automatically falls back to a text lockup in the brand colours,
so nothing ever renders as a broken image. No code changes are needed — add the
file, redeploy, and the real logo appears site-wide.

## og-image.png

The social sharing preview (1200×630) shown when a page is posted to Facebook,
texted, or shared on LinkedIn. Regenerate it after adding `logo.png` with:

```bash
npm run og
```

## mark.svg / favicon.svg

Browser tab icon. Generated from the brand palette. Replace if you have an
official icon mark.
