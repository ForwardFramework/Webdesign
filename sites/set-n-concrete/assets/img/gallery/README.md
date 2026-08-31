# Project photos

The "Our work" gallery ships with a branded concrete texture in each tile so a fresh
install never requests a missing file. To use real photos:

1. Save each image here with the exact filename below.
2. Uncomment that image's line in `assets/css/gallery-photos.css`.
3. Update the matching `<figcaption>` **and** `aria-label` in `index.html` so the
   caption and the alt text describe the photo you actually used. The `aria-label`
   is what a screen reader and an image crawler see — leaving a stale description
   there is worse than having no photo.

| Filename                    | Tile                    |
| --------------------------- | ----------------------- |
| `concrete-driveway.jpg`     | Concrete driveway       |
| `stamped-patio.jpg`         | Stamped patio           |
| `excavation-site-prep.jpg`  | Excavation & site prep  |
| `epoxy-garage-floor.jpg`    | Epoxy garage floor      |
| `metal-roof.jpg`            | Metal roof replacement  |
| `retaining-wall.jpg`        | Retaining wall          |

**Specs:** landscape, roughly 1200×800, WebP or JPG, compressed under ~250 KB each.
Use your own job photos rather than stock — real local work is the single strongest
trust signal on a contractor site, and it is the content search engines and AI
assistants use to distinguish you from a template.
