/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  REVIEWS — READ THIS BEFORE EDITING
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Only genuine, published customer reviews belong in this file.
 *
 *  Every entry below with `verified: true` was located in a public listing for
 *  Top Dog Exteriors and is reproduced as written by the customer. Nothing in
 *  this file is invented, paraphrased or "representative" copy.
 *
 *  The FTC's Rule on Consumer Reviews and Testimonials (16 CFR Part 465,
 *  effective October 2024) makes writing, buying or publishing a fake or
 *  misattributed consumer review a civil-penalty offense. Do not add a
 *  testimonial you cannot point to a real published source for.
 *
 *  TO ADD YOUR GOOGLE / FACEBOOK / BBB REVIEWS:
 *  Copy the review text verbatim from the platform, add the reviewer name
 *  exactly as it appears publicly, set `source`, `rating` and `date`, and set
 *  `verified: true`. See `docs/REVIEWS.md` for the step-by-step, including how
 *  to switch on the live Google review feed instead of pasting them by hand.
 */

export type ReviewSource = 'Google' | 'Facebook' | 'BBB' | 'HomeAdvisor' | 'Angi' | 'Nextdoor';

export type Review = {
  quote: string;
  author: string;
  source: ReviewSource;
  rating: 1 | 2 | 3 | 4 | 5;
  /** ISO date, or null when the platform listing does not publish one. */
  date: string | null;
  /** Which service the job was — drives filtering on /reviews. */
  service?: string;
  location?: string;
  verified: boolean;
};

/** Aggregate ratings shown in the review header and in AggregateRating schema. */
export const ratingSummary = {
  /**
   * `count` values are intentionally null until the real platform counts are
   * filled in. A null count renders the badge without a number rather than
   * publishing a figure we cannot substantiate — Google penalises unverifiable
   * AggregateRating markup, and inflating it is a compliance problem.
   */
  platforms: [
    { source: 'Google' as const, rating: 5.0, count: null as number | null, url: 'https://www.google.com/search?q=Top+Dog+Exteriors+Bethel+Park+PA' },
    { source: 'Facebook' as const, rating: 5.0, count: null as number | null, url: 'https://www.facebook.com/gettopdog/reviews' },
    { source: 'BBB' as const, rating: null as number | null, count: null as number | null, url: 'https://www.bbb.org/us/pa/bethel-park/profile/home-improvement/top-dog-exteriors-0141-71127170', note: 'BBB Accredited since 2025' },
  ],
};

export const reviews: Review[] = [
  {
    quote:
      'Top Dog Exteriors did a phenomenal job replacing the soffit on the front of our home. We had an old skylight hole that needed covered over, and some insulation taken care of as part of the job. The crew showed up on time, and had the whole job done in about 2 hours. I appreciated that they had someone come through once it was all done to inspect the work to make sure it was done well.',
    author: 'Verified HomeAdvisor customer',
    source: 'HomeAdvisor',
    rating: 5,
    date: null,
    service: 'siding',
    location: 'Greater Pittsburgh',
    verified: true,
  },
  {
    quote:
      'Top Dog was very professional with handling my work at my house. Tyler is a down to earth normal person that can communicate well. Understood our needs and heard our concerns.',
    author: 'Verified HomeAdvisor customer',
    source: 'HomeAdvisor',
    rating: 5,
    date: null,
    location: 'Greater Pittsburgh',
    verified: true,
  },
  {
    quote: 'These guys are amazing they transformed a small space into a huge shed.',
    author: 'Verified HomeAdvisor customer',
    source: 'HomeAdvisor',
    rating: 5,
    date: null,
    service: 'additions',
    location: 'Greater Pittsburgh',
    verified: true,
  },

  /* ───────────────────────────────────────────────────────────────────────
   *  ADD YOUR GOOGLE, FACEBOOK AND BBB REVIEWS BELOW.
   *  Template — copy, fill in verbatim from the platform, delete this comment:
   *
   *  {
   *    quote: 'Paste the review exactly as the customer wrote it.',
   *    author: 'Name exactly as shown publicly',
   *    source: 'Google',
   *    rating: 5,
   *    date: '2026-05-14',
   *    service: 'roofing',
   *    location: 'Mt. Lebanon, PA',
   *    verified: true,
   *  },
   * ─────────────────────────────────────────────────────────────────────── */
];

export const verifiedReviews = reviews.filter((r) => r.verified);

export const reviewsForService = (slug: string) =>
  verifiedReviews.filter((r) => r.service === slug);

/** True once enough real reviews exist to justify a carousel over a static row. */
export const hasEnoughForCarousel = verifiedReviews.length >= 5;
