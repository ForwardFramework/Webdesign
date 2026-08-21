# Images

Every file in here is a **generated placeholder**. Each one is already the right filename and
the right dimensions, and each one is labelled with the shot it stands in for. Drop your real
photo over the top with the same filename and the site picks it up — no code changes.

## How to swap a photo in

1. Crop to the aspect ratio listed below (the placeholder file already is — open it to check).
2. Export as JPEG, quality ~80, **max 1800px on the long edge**. Nothing here needs to be bigger.
3. Save it over the existing file, keeping the exact filename.
4. Done. `width`/`height` are hard-coded in the HTML, so as long as the aspect ratio matches
   there is no layout shift.

If you change an aspect ratio, update the matching `width`/`height` attributes in `_src/*.html`
and re-run `python3 build.py` — otherwise the page will jump as the image loads.

## What goes where

| File | Size | Ratio | The shot |
|---|---|---|---|
| `hero-exterior.jpg` | 1800×1200 | 3:2 | Homepage + exterior page hero. Best full-house shot you own — ladders up reads as "working", finished reads as "premium". |
| `hero-interior.jpg` | 1600×1067 | 3:2 | Interior page hero. Bright, wide, freshly painted living space. |
| `hero-cabinets.jpg` | 1600×1067 | 3:2 | Cabinet page hero. Finished kitchen, doors closed, hardware on. |
| `hero-reno.jpg` | 1600×1067 | 3:2 | Renovation page hero. Finished kitchen or bath. |
| `hero-about.jpg` | 1600×1067 | 3:2 | Brian and crew on site, in branded shirts. |
| `ba-brick-before.jpg` / `-after.jpg` | 1200×800 | 3:2 | **Must be the same camera position.** Painted-brick transformation. |
| `ba-tudor-before.jpg` / `-after.jpg` | 1200×800 | 3:2 | Same camera position. Second exterior pair. |
| `ba-basement-before.jpg` / `-after.jpg` | 1200×800 | 3:2 | Same camera position. Basement pair. |
| `svc-exterior.jpg` | 900×675 | 4:3 | Service card — exterior |
| `svc-interior.jpg` | 900×675 | 4:3 | Service card — interior |
| `svc-cabinets.jpg` | 900×675 | 4:3 | Service card — cabinets |
| `svc-reno.jpg` | 900×675 | 4:3 | Service card — renovations |
| `svc-basement.jpg` | 900×675 | 4:3 | Service card — basements |
| `svc-exteriorplus.jpg` | 900×675 | 4:3 | Service card — roofing / siding / gutters / masonry |
| `brian.jpg` | 800×800 | 1:1 | Owner portrait. A real photo of Brian beats anything staged. |
| `crew.jpg` | 1200×800 | 3:2 | Team photo. |
| `og-image.jpg` | 1200×630 | 1.91:1 | Social share card. Best before/after + logo + phone number. |
| `guide-cover.jpg` | 800×1000 | 4:5 | Lead-magnet cover (only if you build the checklist PDF). |
| `gallery/g01–g12.jpg` | 900×675 | 4:3 | Portfolio grid. Captions and categories live in `_src/gallery.html`. |

## The before/after pairs matter most

They are the single most persuasive thing on the site. To make them work:

- **Same position, same lens, same time of day.** If the two shots don't line up, the slider
  looks like two different houses and the effect is lost.
- Shoot the "before" *before you touch anything* — this is the shot everyone forgets.
- Overcast light is more flattering on siding than harsh midday sun.
- Get the whole house in frame with a little sky and a little ground.

Standing habit worth building: every job, take the same four shots before the crew unloads and
the same four after the walk-through. Within a season you'll have more usable pairs than you
can fit on the site.
