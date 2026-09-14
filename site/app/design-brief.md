# KB Countertops — design brief

## Design read
For a Tampa Bay homeowner about to spend five figures on a kitchen, and for the
builder specifying forty units at once. The register is quiet authority: a
nineteen-year-old family fabricator that imports its own stone and cuts it with
its own hands. Confidence, not salesmanship.

## Concept spine
**The slab becomes the counter.** The whole site is one uninterrupted pass down
a single piece of stone — chosen, measured, cut, installed. Every chapter is a
closer look at the same surface, which is exactly what the scroll-scrub film
does and exactly what the company actually sells: one slab, handled start to
finish by one team.

## Delivery tier
`cinema` — Lenis-free, controller-owned scrub for the hero journey, transform-only
entrance motion for surrounding chrome, micro-motion elsewhere.

## Locked palette
Taken verbatim from the client's existing brand, which overrides the default
palette bans (the flow permits an override only for explicit brand colors — these
are sampled from the live logo file and the live site's stylesheet):

- `#0A0A0A` obsidian — the logo plate's own background, the site ground
- `#C49E33` antique gold — sampled pixel-exact from the KB logo lettering
- `#D4A843` lit gold — the live site's brighter gold, used for hover/active only
- `#D2B48C` tan stone — the live site's secondary, warm neutral for rules + captions
- `#3F2C04` burnt umber — the live site's deep brown, used for shadow washes
- `#F4F1EA` bone — the light-section ground, warmer than white so gold stays warm

Defense: this is not a chosen palette, it is a measured one. The gold is the
logo's own ink value, so the mark sits on the page without a halo or a plate.

## Locked type
- Display: **Cabin** 600/700, uppercase, tight tracking — the client's existing
  heading face.
- Body: **Source Sans 3** 400/600 — the client's existing body face.
- Pull quotes: **Bitter** 400 italic — the client's existing serif. Serif is
  justified here because it is already in the brand, used only for testimony.

## Animation mode
Animation mode: animated-website — user unreachable on a remote async session,
so the flow's recommended default was taken and stated in the reply.

### Journey shape
`single-shot` — one continuous ~15s push-in down a single quartzite island. The
story is one subject seen ever more closely, which is the textbook single-shot
case, and it reaches the client in minutes instead of legs.

### Journey (chapters over the one film)
1. **Selection** — the slab emerging from darkness. Focal point: the full island
   edge. Proof: 500+ slabs, imported direct.
2. **Template** — mid push, the edge running away from camera. Focal point: the
   waterfall mitre. Proof: laser templated.
3. **Fabrication** — closer, the vein turning into the cut. Focal point: the
   polished arris. Proof: cut in-house, never subcontracted.
4. **Installation** — macro, the gold vein under raking light. Focal point: the
   finished seam. Proof: 10-year warranty, 50,000 installs.

### World grammar
Studio-black seamless, deep charcoal surround, single soft raking key from
camera-left, mirror-polish finish, antique-gold specular on the veining, tan
midtones, locked exposure and white balance, shallow depth of field, 85mm.
Subject centered with clean negative space for the chapter copy.

### Mobile framing
Every focal point sits inside the center-safe band; mobile encode capped at
720p so the vein detail survives the downscale.

### Delivery budget
Desktop clip <= 32 MiB, mobile clip <= 16 MiB.

## Section plan (no consecutive layout repeats)
1. Scrub journey (film + chapters)
2. Ticker stat band
3. Editorial split — the 2007 story
4. Material card grid
5. Numbered process rail
6. Offset project gallery
7. Quote wall — reviews
8. Showroom location cards
9. Estimate CTA slab
10. Footer

Eyebrow budget: 10 sections -> ceil(10/3) = 4 eyebrows. Spent on sections 3, 4,
5 and 8.

## Asset plan
- Hero film: the single-shot scrub clip + its exact-frame posters (desktop +
  mobile), generated with Higgsfield.
- Storyboard: one 6-panel keyframe board, kept in `refs/`.
- Real client photography pulled from the client's own live CDN for the material
  grid, the gallery and the process rail — the brief calls for their actual work,
  not stand-ins.
- The client's real logo file, used as-is in the header and footer.
- OG/launch cover composed from a film frame under the real logo.

## CTA inventory (each with its own interaction identity)
- **`estimate-cta`** — solid gold slab, presses down 1px on active, gold bleeds
  wider on hover. The primary book-an-estimate action.
- **`call-cta`** — hairline gold outline that fills from the left on hover; the
  phone number stays legible throughout. Header + locations.
- **`chapter-cta`** — text with a gold rule that draws left-to-right under it on
  hover. Used inside the journey chapters only.
- **`directions-cta`** — small tan caps with a trailing arrow that steps right
  on hover. Location cards only.
- **`material-cta`** — whole card is the target; the gold hairline border lights
  and the image scales inside its own overflow box.
