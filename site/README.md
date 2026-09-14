# KB Countertops — new website

Source for the rebuilt [kbcountertops.com](https://kbcountertops.com) marketing site,
built on the Higgsfield website builder (React 19 + TanStack Start, server-rendered,
deployed as a single Cloudflare Worker).

## What is here

This directory mirrors the deployed project's `app/` tree — only the files authored
for KB are tracked; the platform scaffold lives in the deploy repo.

| Path | What it is |
|---|---|
| `app/design-brief.md` | The design contract: concept spine, locked palette and type, journey, section plan, CTA inventory |
| `app/src/kb-content.ts` | Every fact on the site — services, materials, process, showrooms, reviews, service area |
| `app/src/kb-brand.css` | The brand token layer and all component styling |
| `app/src/scroll-scrub-scenes.ts` | The four chapters of the scroll-driven film |
| `app/src/routes/index.tsx` | The page composition |
| `app/src/app-meta.json` | Title, description, favicon, OG and cover images |

## Brand

Colours and fonts were measured from the client's existing assets rather than chosen:

- `#c49e33` antique gold — sampled pixel-exact from the lettering in the live logo file
- `#0a0a0a` obsidian — the logo plate's own background
- `#d4a843`, `#d2b48c`, `#3f2c04` — the live site's gold, tan and umber
- Cabin, Source Sans 3 and Bitter — the three faces the live site already loads

The real logo file is used as-is for the header, footer, favicon and cover.

## Content provenance

Copy, services, the five-step process, addresses, hours, phone numbers and the
general contractor licence number were taken from the company's own live pages.
Review quotes and the 4.7 rating come from its public Google, Yelp and Angi
listings. Project photography is the company's own, pulled from its live CDN and
self-hosted. Nothing on the site is invented.

## Hero film

The scroll journey is one continuous 15s take generated with Higgsfield, cut into
four consecutive slices of that same take, so each chapter's last frame is the next
chapter's first frame and the scrub reads as one unbroken camera move. Every poster
is the exact first frame of the encoded clip beside it.
