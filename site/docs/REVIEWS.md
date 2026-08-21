# Reviews — how the review data works

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

53 reviews, taken verbatim from the live Google, Facebook and BBB listings.

## The shape

```ts
{
  quote: 'Paste the review exactly as the customer wrote it.',
  author: 'Name exactly as it appears publicly',   // e.g. 'Sarah M.'
  source: 'Google',                                // the platform the text was taken from
  alsoOn: ['Facebook'],                            // optional — see "Deduplication"
  rating: 5,
  date: 'May 2026',                                // as the platform displays it
  truncated: true,                                 // optional — see "Truncated text"
  service: 'roofing',                              // optional — a slug from services.ts
  verified: true,
},
```

Tagging `service` makes the review appear on that trade's page and in the
`/reviews` filter chips, which is where it does the most work.

### Deduplication

Plenty of customers left the same review on more than one platform — a Google review and
a Facebook recommendation, or a Google review and a BBB review. Each customer appears in
the data **once**, and the entry is attributed to whichever platform carries the fullest
text. The other platforms go in `alsoOn`, which renders as
"Google · also on Facebook · May 2026".

When adding a review, search `reviews.ts` for the author's name first. If they are
already there, add the new platform to their `alsoOn` rather than creating a second
entry — a repeated testimonial reads as padding and inflates the count dishonestly.

### Truncated text

Google and BBB cut long reviews off behind a "More" link. Where the full text was not
available, the entry keeps the platform's truncation and sets `truncated: true`, which
renders a trailing ellipsis. The text is never invented forward to make a card look
complete.

## The platform ratings

`ratingSummary.platforms` drives the three rating cards on `/reviews` and the pill row in
the homepage reviews section. The three platforms do not use the same scale, so each
entry carries a `display` string and a `label` rather than a single number:

```ts
{ source: 'Google',   rating: 5.0,  display: '5.0',  label: 'out of 5',    note: null },
{ source: 'Facebook', rating: 5.0,  display: '100%', label: 'recommend',   note: '29 recommendations' },
{ source: 'BBB',      rating: null, display: 'A',    label: 'BBB rating',  note: 'Accredited since 2025' },
```

- **`display` / `label`** are what the visitor reads. Facebook reports a recommend
  percentage, not a star average; the BBB issues a letter grade. Rendering either as
  "5.0 stars" would misstate what the platform actually publishes.
- **`rating`** is the numeric star value, used for the star row and for structured data.
  It is `null` for the BBB, whose letter grade has no star equivalent — the card renders
  an award icon instead of stars.
- **`note`** is the supporting count or credential, shown small underneath.

Update these when the real numbers change. A visibly stale count is worse than no count.

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
