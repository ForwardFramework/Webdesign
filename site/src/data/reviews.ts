/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  REVIEWS — READ THIS BEFORE EDITING
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Only genuine, published customer reviews belong in this file. Every entry
 *  below was supplied by the owner from the live Google, Facebook and BBB
 *  listings and is reproduced as the customer wrote it.
 *
 *  DEDUPLICATION
 *  Many customers posted the same review to more than one platform. Each person
 *  appears exactly once here, attributed to the platform carrying the fullest
 *  version of their text; `alsoOn` records the other platforms they posted to,
 *  which the UI surfaces as "also on Facebook, BBB".
 *
 *  Where the source text was truncated by the platform ("… More"), the review is
 *  stored truncated with `truncated: true` rather than invented forward. The UI
 *  renders an ellipsis and a link to read the rest on the platform.
 *
 *  ⚠  The FTC's Rule on Consumer Reviews and Testimonials (16 CFR Part 465)
 *  makes publishing a fake or misattributed consumer review a civil-penalty
 *  offense. Do not add a testimonial you cannot point to a real published source
 *  for, and do not edit a customer's words to read better.
 */

export type ReviewSource = 'Google' | 'Facebook' | 'BBB' | 'HomeAdvisor' | 'Angi' | 'Nextdoor';

export type Review = {
  quote: string;
  author: string;
  /** Platform the quoted text is taken from. */
  source: ReviewSource;
  /** Other platforms the same customer posted to. */
  alsoOn?: ReviewSource[];
  rating: 1 | 2 | 3 | 4 | 5;
  /** Roughly when it was posted, as shown on the platform. */
  date: string;
  /** True when the platform itself cut the text off. */
  truncated?: boolean;
  /** Service slug — drives filtering on service pages. */
  service?: string;
  verified: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
 *  AGGREGATE RATINGS
 *  Facebook uses a recommend/don't-recommend model rather than stars, so "100%
 *  recommend" is the honest figure and 5.0 is its star equivalent. BBB publishes
 *  a letter grade for the business separately from customer review scores — the
 *  A is the business rating, not an average of the reviews below.
 * ───────────────────────────────────────────────────────────────────────────── */
export const ratingSummary = {
  platforms: [
    {
      source: 'Google' as const,
      rating: 5.0,
      display: '5.0',
      label: 'out of 5',
      note: null as string | null,
      url: 'https://www.google.com/search?q=Top+Dog+Exteriors+Bethel+Park+PA',
    },
    {
      source: 'Facebook' as const,
      rating: 5.0,
      display: '100%',
      label: 'recommend',
      note: '29 recommendations',
      url: 'https://www.facebook.com/gettopdog/reviews',
    },
    {
      source: 'BBB' as const,
      rating: null,
      display: 'A',
      label: 'BBB rating',
      note: 'Accredited since 2025',
      url: 'https://www.bbb.org/us/pa/bethel-park/profile/home-improvement/top-dog-exteriors-0141-71127170',
    },
  ],
};

export const reviews: Review[] = [
  /* ── Roofing ─────────────────────────────────────────────────────────── */
  {
    quote:
      'I’ve worked with Top Dog Exteriors on multiple roofing projects as a general contractor, and they have consistently delivered excellent results. Their team is professional, responsive, and takes pride in the quality of their work. They show',
    author: 'Mike Lucas',
    source: 'Google',
    alsoOn: ['Facebook'],
    rating: 5,
    date: '2 months ago',
    truncated: true,
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'The crew did an outstanding job — extremely clean, highly professional, and impressively efficient. Their communication throughout the project was excellent, keeping me informed at every step. They had repaired my roof last year, and when a severe storm came through, I knew exactly who to call. The owner was on site to check the workmanship, which gave me even more confidence in the quality of the project. The roof looks fantastic, and the entire process was smooth and well-executed. I couldn’t be happier with the results.',
    author: 'Patrick Buggy',
    source: 'BBB',
    alsoOn: ['Google', 'Facebook'],
    rating: 5,
    date: 'March 2026',
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'Answered my request for an estimate to repair storm damage to my home with inspection, and estimate in two days. When I confirmed and signed work started next day. Work was completed within two days and I added other items as the quality and attention to detail was first rate. I recommend.',
    author: 'Howard Booth',
    source: 'Google',
    rating: 5,
    date: '3 months ago',
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'Shout out to Ty with Top Dog for coming in clutch for a client of mine. Ty got me a quote for a whole new roof within 15 minutes of being asked. Not only was his communication key but the pricing was great too! My clients are super thankful for their nice new roof! I will absolutely be recommending this company again!',
    author: 'Brittany Heyl',
    source: 'Google',
    alsoOn: ['Facebook'],
    rating: 5,
    date: '11 months ago',
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'Top Dog did a great job replacing our roof! They were fairly priced and clearly communicated the expectations. They also worked quickly to get our roof done when winter weather was an issue. I would use them again for any new outdoor project!',
    author: 'Zack Walker',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'February 2025',
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'Very pleased from start to finish Tyler and nick where great, super communication and addressed all our roofing issues fast will tell all our neighbors and friends about the great job they did and the job was completed within the estimated budget.',
    author: 'Ronald Carter',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    service: 'roofing',
    verified: true,
  },
  {
    quote:
      'Did an amazing job for an amazing price for a roof replacement! Would recommend them to anyone in the Pittsburgh area!',
    author: 'Alex Roberts',
    source: 'Facebook',
    rating: 5,
    date: 'September 2025',
    service: 'roofing',
    verified: true,
  },
  {
    quote: 'Put a roof on my dads house fairly quickly! We are in love with their work and no complaints.',
    author: 'Syd Jonas',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'September 2024',
    service: 'roofing',
    verified: true,
  },

  /* ── Decks ───────────────────────────────────────────────────────────── */
  {
    quote:
      'I recently hired Top Dog Exteriors to replace my deck and I couldn’t be more pleased with the results. They were easy to work with and the quality of their work speaks for itself—the new deck looks fantastic. I would absolutely recommend them to anyone looking for deck work.',
    author: 'Janet Cole',
    source: 'Google',
    rating: 5,
    date: '2 months ago',
    service: 'decks',
    verified: true,
  },
  {
    quote:
      'From getting quotes and prompt responses from Tyler (owner), to experiencing high quality and professional interactions with their field crew; our overall experience of working with the Top Dog Exteriors team far exceeded our expectations. Our deck looks "amazing"! Additionally, the field crew was very careful and minimized the disturbance of our yard.',
    author: 'Ricardo Chambers',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'September 2025',
    service: 'decks',
    verified: true,
  },
  {
    quote:
      'From planning to completion, Top Dog Exteriors was excellent. Project was to replace the wood from the old porch with Treks and to replace the old steps also with Treks. Tyler and his crew did an excellent job and I would highly recommend them for your next project. Their pricing was very fair and their workmanship was top-notch. I would definitely use them again in the future.',
    author: 'Ted L.',
    source: 'BBB',
    rating: 5,
    date: 'April 2026',
    service: 'decks',
    verified: true,
  },
  {
    quote:
      'The only thing more impressive than the craftsmanship was the customer service! The deck turned out even more beautiful than we dreamed.',
    author: 'Jonathan Bazylak',
    source: 'Google',
    alsoOn: ['Facebook'],
    rating: 5,
    date: 'a year ago',
    service: 'decks',
    verified: true,
  },
  {
    quote:
      'Top Dog Exteriors helped us to design and then built most beautiful deck for us. Tyler, Tony and the crew were so incredibly professional, respectful, RESPONSIVE and knowledgeable. We were honestly shocked by how quickly Ty & Tony responded to our questions and concerns. Like any project, we had a few bumps in the road, but these guys absolutely refused to let it ruin anything. They responded so quickly and made changes faster than',
    author: 'Ashley Lynn',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'July 2024',
    truncated: true,
    service: 'decks',
    verified: true,
  },
  {
    quote: 'Deck built for pool, great quality and craftsmanship!!! Highly recommend',
    author: 'Jennifer S.',
    source: 'BBB',
    rating: 5,
    date: 'July 2026',
    service: 'decks',
    verified: true,
  },
  {
    quote:
      'I couldn’t be happier with my new deck! The craftsmanship is outstanding, using high-quality materials that not only look great but also promise longevity. The design blends seamlessly with my home, creating the perfect space for relaxation',
    author: 'Todd Beatty',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    truncated: true,
    service: 'decks',
    verified: true,
  },
  {
    quote: 'Couldn’t be happier with our new deck!!! Fast, professional, hard working.. EXCELLENT!!!! give them a call!!!!',
    author: 'Kristen Allen',
    source: 'Google',
    alsoOn: ['Facebook'],
    rating: 5,
    date: '2 years ago',
    service: 'decks',
    verified: true,
  },
  {
    quote: 'Superb deck installation, fast and was able to meet my recommendations! Awesome facelift!',
    author: 'Mark Breis',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'July 2024',
    service: 'decks',
    verified: true,
  },
  {
    quote: 'Had a new deck installed and very happy with the finished product!',
    author: 'Bryan Fichter',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'July 2025',
    service: 'decks',
    verified: true,
  },

  /* ── Siding ──────────────────────────────────────────────────────────── */
  {
    quote:
      'I used Top Dog Exteriors for some siding work on my house. I couldn’t be more pleased with the results. They were able to get to me within a week of contacting them. The crew did an amazing job and was able to finish in one day. We have a steep roof which I thought was going to be an issue but they were able to handle it no problem. I will definitely be using them in the future for other projects around the house.',
    author: 'Dale Kaufman',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'August 2024',
    service: 'siding',
    verified: true,
  },
  {
    quote:
      'Tyler and his crew came to our rescue after another contractor left us with an unfinished project. They sealed and wrapped our windows which were left exposed by the previous contractor, reset our doors and then did a fantastic job siding our property. The work was meticulous and communication was excellent. Excellent. We intend to use them for another project in the near future.',
    author: 'Melissa Anne',
    source: 'Facebook',
    alsoOn: ['Google', 'BBB'],
    rating: 5,
    date: 'February 2026',
    service: 'siding',
    verified: true,
  },
  {
    quote:
      'They did an amazing job. Could’ve cost me a fortune by buying an entire box of siding. But they went the extra mile to find the pieces I needed. Fast and efficient.',
    author: 'Ma M.',
    source: 'BBB',
    rating: 5,
    date: 'April 2026',
    service: 'siding',
    verified: true,
  },
  {
    quote:
      'These guys are great! Top Dog Exteriors did a phenomenal job replacing the soffit on the front of our home. We had an old skylight hole that needed covered over, and some insulation taken care of as part of the job. The crew showed up on time, and had the whole job done in about 2 hours. I appreciated that they had someone come through once it was all done to inspect the work to make sure it was done well. Can’t recommend them enough.',
    author: 'Andrew Pricener',
    source: 'Facebook',
    alsoOn: ['Google', 'BBB'],
    rating: 5,
    date: 'June 2025',
    service: 'siding',
    verified: true,
  },
  {
    quote:
      'I couldn’t be happier with choosing top dog exteriors for my outdoor home improvement project of replacing my shutters and I also had the garage painted and the before and after goes crazy! Tyler helped me every step of the way over a month or so of communication! Thank you!!!',
    author: 'Samantha Shumaker',
    source: 'Google',
    rating: 5,
    date: '3 months ago',
    service: 'painting',
    verified: true,
  },

  /* ── Gutters ─────────────────────────────────────────────────────────── */
  {
    quote:
      'We knew our gutters were leaking and need of repairs. However our last attempt led to a lot of phone calls, appointment with no show contractors or an extremely high estimate which included additional unnecessary items. That was the opposite experience with TOP DOG EXTERIOR. A friend referred us and Tyler showed up the same wk with text updates on his arrival. He was respectful of our time and submit a fair bid that we accepted. While spending any dollar amount is never easy his price was fair and the work was done in timely manner with worker that showed up and diligently did their job. The next extremely large summer thunderstorm was that same night confirming what we already knew. They did a fantastic job and we needed our gutters done more than we had realized. We definitely recommend',
    author: 'Casi H.',
    source: 'BBB',
    alsoOn: ['Google'],
    rating: 5,
    date: 'July 2026',
    service: 'gutters',
    verified: true,
  },
  {
    quote: 'Did an awesome job with the gutters, kept prices low and always kept me up to date with speedy service',
    author: 'Spike Leonhart',
    source: 'BBB',
    alsoOn: ['Google', 'Facebook'],
    rating: 5,
    date: 'April 2026',
    service: 'gutters',
    verified: true,
  },
  {
    quote:
      'Top dog exteriors did a great job from start to finish. Pricing was fair and well communicated. workers were friendly and finished the job right and fast. Highly recommend to anyone considering getting their roof and/or gutters and downspouts done. A+',
    author: 'Guiseppie Conte',
    source: 'Facebook',
    rating: 5,
    date: 'November 2024',
    service: 'gutters',
    verified: true,
  },
  {
    quote:
      'I was disappointed with a contractor that I used in the past. I was disappointed in his work. I was getting water down in my basement it wasn’t emptying into the gutter system. So I was able to find Top Dog contractors they explain to me',
    author: 'Google reviewer',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    truncated: true,
    service: 'gutters',
    verified: true,
  },

  /* ── Windows ─────────────────────────────────────────────────────────── */
  {
    quote:
      'We had new windows installed and we are very happy with the results. These are personable guys and make the experience enjoyable. They fully clean up the mess and I highly recommend them. We will need work in the future and I will not hesitate to call them',
    author: 'Deborah S.',
    source: 'BBB',
    rating: 5,
    date: 'July 2026',
    service: 'windows',
    verified: true,
  },

  /* ── Concrete & patios ───────────────────────────────────────────────── */
  {
    quote:
      'I couldn’t recommend Tyler and his team more. They completely transformed our back patio. Tyler was great to work with, reasonable, honest and fair. Truly couldn’t be more pleased with the job.',
    author: 'Meridith Gould',
    source: 'Google',
    alsoOn: ['Facebook', 'BBB'],
    rating: 5,
    date: '3 months ago',
    service: 'concrete',
    verified: true,
  },
  {
    quote:
      'We are so extremely pleased with the deck and concrete that was done for us. Our precious situation was small and rotting and they built us a beautiful addition that came out better than we expected. They were punctual, communicative, and',
    author: 'Kristen Turner',
    source: 'Google',
    rating: 5,
    date: '4 months ago',
    truncated: true,
    service: 'concrete',
    verified: true,
  },
  {
    quote:
      'We had a fantastic experience working with Tyler and the team at Top Dog Exteriors on our concrete patio project. From the initial quote to the final cleanup, everything was handled professionally and with great care. Tyler was incredibly',
    author: 'Christopher Nowacki',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    truncated: true,
    service: 'concrete',
    verified: true,
  },

  /* ── Additions & outbuildings ────────────────────────────────────────── */
  {
    quote: 'These guys are amazing. They transformed a small space into a huge shed',
    author: 'Cynthia Cypher',
    source: 'Google',
    rating: 5,
    date: '10 months ago',
    service: 'additions',
    verified: true,
  },
  {
    quote:
      'Top Dog Exteriors is THE BEST. I wanted essentially a day bed built in my backyard. They scheduled me the same day I contacted them and within just a few days it was fully completed beautifully. Perfection. Arrived on time as promised and work was done faster than expected. I love it. Sturdy and beautiful. They even looked at my original plans and suggested a few improvements to the design that even saved money!! Can’t say enough goo',
    author: 'Nikki Johnson',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'October 2024',
    truncated: true,
    service: 'additions',
    verified: true,
  },
  {
    quote:
      'Tyler & team did a great job recruiting lacing our back porch stairs and landing! Excellent communication throughout the process. Workers cleaned up after themselves. A couple odds & ends to finish up after themselves main work was done,',
    author: 'C.S. Lannen',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    truncated: true,
    service: 'additions',
    verified: true,
  },

  /* ── General ─────────────────────────────────────────────────────────── */
  {
    quote:
      'We couldn’t be happier with the work done by Top Dog Exterior Remodeling. Tyler was fantastic at communicating throughout the entire process, coming by a couple of times to explain what the job would cover and making sure we were comfortable every step of the way. His team of professionals were detail-oriented, respectful, and highly skilled. They stuck to the timelines they promised and showed up exactly when they said they would—a h',
    author: 'Hernan Pettinaroli',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'December 2024',
    truncated: true,
    verified: true,
  },
  {
    quote:
      'Helped out my father in law with a small issue that many companies wouldn’t even consider. Stand up guy. Support your veteran owned businesses',
    author: 'Ron Obringer',
    source: 'Google',
    alsoOn: ['Facebook', 'BBB'],
    rating: 5,
    date: '4 months ago',
    verified: true,
  },
  {
    quote:
      'I was very happy with this company! Tyler was extremely responsive and helpful. The customer service was great! And they did a wonderful job. I Definitely Highly Recommend, and would use again!',
    author: 'Mike Weber',
    source: 'Google',
    alsoOn: ['BBB'],
    rating: 5,
    date: '4 months ago',
    verified: true,
  },
  {
    quote:
      'Highly recommend TopDog! Quick response and quality craftsmanship! I will definitely call again when needed! Thanks again Ty',
    author: 'Mike Evans',
    source: 'Facebook',
    alsoOn: ['Google', 'BBB'],
    rating: 5,
    date: 'April 2026',
    verified: true,
  },
  {
    quote: 'TopDog is great. Great work. Polite and professional. Highly recommend will call back for more jobs.',
    author: 'Karen Vogel',
    source: 'Google',
    rating: 5,
    date: '2 months ago',
    verified: true,
  },
  {
    quote:
      'Ty and his team have done a fantastic job taking care of clients I have referred to him. Pricing is fair and the work performed is excellent. Highly recommend Top Dog!',
    author: "Kelly O'Neill Kasznel",
    source: 'Facebook',
    rating: 5,
    date: 'March 2026',
    verified: true,
  },
  {
    quote:
      'Ty and his team are responsive, professionals with reasonable pricing and we were completely satisfied with both our interior and exterior work!',
    author: 'Zanna Crawford',
    source: 'Google',
    rating: 5,
    date: '4 months ago',
    verified: true,
  },
  {
    quote:
      'Great experience! First major project we outsourced due to health challenges and we were completely satisfied! Price, communication, craftsmanship! Highly recommend this company (didn’t know them before) and would be happy to act as a reference. Would 100% use them again.',
    author: 'Rikki Ebersole Benton',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'October 2024',
    verified: true,
  },
  {
    quote:
      'Top Dog did an amazing job with another one of our revitalization properties! They were quick, professional, affordable, and the communication was flawless! We will be using them again in the future!',
    author: 'Steve Maffei Jr',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'November 2024',
    verified: true,
  },
  {
    quote:
      'The guys did a great job! They did everything in less than 8 hrs. Ty was great to talk to and explain everything. The best was the price!! They were so reasonable unlike other companies. I would definitely work with them again',
    author: 'Cynthia Westcott',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'October 2024',
    verified: true,
  },
  {
    quote:
      'Top dog exteriors came through in a pinch with a total garage clean out just hours prior to a closing deadline. they did an exceptional job. reasonably priced.',
    author: 'Lynsey Tappe',
    source: 'Facebook',
    rating: 5,
    date: 'March 2025',
    verified: true,
  },
  {
    quote: 'Awesome work and pricing was fair. Communicated everything well and work was done fast and right. Stress free! Highly recommend',
    author: 'G C',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    verified: true,
  },
  {
    quote:
      'Great company to work with on completing exterior home improvements. Top Dog Exteriors will both respond and complete the job quickly. I highly recommend them!!',
    author: 'Jo Ann Noble',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    verified: true,
  },
  {
    quote: 'Top Dog Exteriors are very good at their work, timely and very professional. I would recommend them to anyone.',
    author: 'David Cancilla',
    source: 'Google',
    alsoOn: ['Facebook'],
    rating: 5,
    date: 'a year ago',
    verified: true,
  },
  {
    quote: 'Kept me up to date, kept prices low, and was extremely quick',
    author: 'Spike L.',
    source: 'Google',
    rating: 5,
    date: '4 months ago',
    verified: true,
  },
  {
    quote: 'Great work and good customer service! Would reccomend/use again!',
    author: 'JR DeWeese',
    source: 'Google',
    rating: 5,
    date: 'a year ago',
    verified: true,
  },
  {
    quote: 'Great job! Very professional!',
    author: 'Stacy Ball',
    source: 'Facebook',
    alsoOn: ['Google'],
    rating: 5,
    date: 'April 2026',
    verified: true,
  },
  {
    quote:
      'It wasn’t a big job but they had it done quickly and efficiently and will have them back to do some other work as well',
    author: 'Kim O.',
    source: 'BBB',
    rating: 5,
    date: 'July 2025',
    verified: true,
  },
  {
    quote: 'Very good work, good people who are friendly and excellent at their work.',
    author: 'David C.',
    source: 'Facebook',
    rating: 5,
    date: 'August 2024',
    verified: true,
  },
];

export const verifiedReviews = reviews.filter((r) => r.verified);

export const reviewsForService = (slug: string) => verifiedReviews.filter((r) => r.service === slug);

/** Reviews for a service, topped up with general ones so a section never looks thin. */
export const reviewsForDisplay = (slug: string | undefined, limit: number) => {
  if (!slug) return verifiedReviews.slice(0, limit);
  const scoped = reviewsForService(slug);
  if (scoped.length >= limit) return scoped.slice(0, limit);
  const filler = verifiedReviews.filter((r) => !r.service && !scoped.includes(r));
  return [...scoped, ...filler].slice(0, limit);
};

/** Distinct customers, for the "X verified reviews" line. */
export const reviewCount = verifiedReviews.length;
