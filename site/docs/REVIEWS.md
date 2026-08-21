# Reviews — adding your Google, Facebook and BBB reviews

Reviews live in **`src/data/reviews.ts`**. They render on `/reviews`, on the homepage,
and on service pages (filtered by trade where a review is tagged with one).

## Read this first

**Only publish reviews that exist on a real, public listing, reproduced word for word.**

The FTC's Rule on Consumer Reviews and Testimonials (16 CFR Part 465, effective October
2024) makes writing, buying, or publishing a fake or misattributed consumer review a
civil-penalty offense — currently over $50,000 per violation. Google also issues manual
actions for `Review` structured data that cannot be verified.

The site is built to be honest about this. `/reviews` links out to every platform so a
homeowner can check for themselves, and `Review` schema is emitted **only** for entries
marked `verified: true`. Adding an invented testimonial breaks that promise and creates
real legal exposure. Don't.

## What is in there now

Three verbatim reviews located on the public HomeAdvisor listing. Everything else is
represented by the platform links, which is deliberate rather than a gap to be papered
over.

## Adding a review

Copy the text **exactly** as the customer wrote it — including typos. Do not tidy it up,
shorten it, or combine two reviews into one.

```ts
{
  quote: 'Paste the review exactly as the customer wrote it.',
  author: 'Name exactly as it appears publicly',   // e.g. 'Sarah M.'
  source: 'Google',                                // Google | Facebook | BBB | HomeAdvisor | Angi | Nextdoor
  rating: 5,
  date: '2026-05-14',                              // ISO, or null if the platform hides it
  service: 'roofing',                              // optional — a slug from services.ts
  location: 'Mt. Lebanon, PA',                     // optional
  verified: true,
},
```

Tagging `service` makes the review appear on that trade's page, which is where it does
the most work.

## Filling in the rating counts

In `ratingSummary.platforms`, `count` is `null` until you supply the real number:

```ts
{ source: 'Google', rating: 5.0, count: 47, url: '…' },
```

A `null` count renders the badge without a number rather than publishing a figure that
cannot be substantiated. Update these when the counts change — a visibly stale count is
worse than no count.

## Live Google reviews instead of pasting

Pasting is fine, but it goes stale. Two ways to automate it:

**1. Google Places API (recommended).** The Place Details endpoint returns up to five
reviews. Add a scheduled serverless function that fetches them and writes
`src/data/reviews.generated.ts`, then trigger a rebuild. Keeps everything static and
fast, and the API key stays server-side. Google's terms require displaying reviews with
attribution and not editing them — which the current markup already does.

**2. A third-party widget** (Elfsight, Trustindex, Featurable, EmbedSocial). Fastest to
set up, and they handle Facebook and BBB too. The trade-off is a third-party script,
some layout shift, and a monthly fee — and their embeds are usually not as accessible as
the markup here.

Whichever route you take, keep the platform links on `/reviews`. Being checkable is the
point.

## Asking for reviews

The single highest-return marketing action available to a contractor. After a
walkthrough, text the customer a direct link:

```
https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID
```

Find your Place ID at <https://developers.google.com/maps/documentation/places/web-service/place-id>.
Ask on the day you finish, in person, while they are standing there looking at the work.
