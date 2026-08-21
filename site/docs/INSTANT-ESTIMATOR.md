# Instant roof estimator (Roofr)

`/instant-roof-quote` embeds Top Dog's hosted **Roofr Instant Estimator**. Leads from it
land in the Roofr account — they do **not** flow through `/api/lead`, so nothing about the
site's own form plumbing touches them.

## Changing the link

One line, in `src/data/site.ts`:

```ts
export const roofr = {
  estimatorUrl: 'https://app.roofr.com/instant-estimator/<id>/TopDogRoofing/welcome-question',
};
```

If you regenerate the estimator in Roofr, paste the new URL here. The page, the embed, the
"open in a new tab" links and the closing CTA all read from it.

## How the embed behaves

`src/components/RoofrEstimator.astro` renders the estimator in an iframe, with three
layers of protection so a homeowner is never left staring at a dead box:

1. **A loading state** while the frame boots.
2. **A reachability probe.** A `no-cors` request to `app.roofr.com` runs alongside the
   frame. If it rejects — Roofr down, DNS failure, a corporate network blocking it — the
   whole panel swaps for a large "Start My Instant Estimate" card that opens the tool in a
   new tab.
3. **An always-visible "open in a new tab" link** under the frame.

That third one is not belt-and-braces, it is necessary. A cross-origin iframe *cannot*
tell its parent page whether it rendered — that is deliberate browser security. If Roofr
ever changed their `frame-ancestors` policy, the frame would silently show a browser error
page and no amount of JavaScript in our page could detect it. The permanent link means the
conversion path survives that.

### Testing the fallback

Block `app.roofr.com` in your browser devtools (Network → block request domain) and reload
`/instant-roof-quote`. You should see the fallback card, not an empty frame.

## Adjusting the height

```astro
<RoofrEstimator height={860} />
```

Default is 760px on desktop, 680px under 620px wide. If Roofr's flow grows and you see an
inner scrollbar, raise it.

## What is no longer here

The first build of this site shipped a custom estimator with its own pricing engine
(`src/scripts/roof-estimate.ts`). That has been removed — Roofr does real satellite
measurement, which is strictly better than deriving roof area from a homeowner's guess at
their square footage. Nothing references the old engine.

One consequence worth knowing: the old tool priced all five roofing systems side by side.
Roofr's flow prices the shingle systems it is configured with. Standing seam metal,
exposed fastener metal, TPO and EPDM are quoted directly by phone, and the page's FAQ says
so plainly rather than implying the tool covers them.
