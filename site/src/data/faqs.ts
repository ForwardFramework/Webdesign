import type { Faq } from './types';

/**
 * FAQs do double duty:
 *  1. They answer what buyers actually ask.
 *  2. They are the AEO/GEO surface — these exact strings are what an answer
 *     engine lifts. So each answer leads with the direct answer in the first
 *     sentence, stays under ~60 words, and avoids marketing language that a
 *     model would (correctly) discount.
 * They are emitted as FAQPage JSON-LD on the relevant pages.
 */

export const FAQS: Faq[] = [
  // ── Lakewood Ranch basics ──
  {
    id: 'what-is-lwr',
    category: 'Lakewood Ranch basics',
    question: 'What is Lakewood Ranch, Florida?',
    answer:
      'Lakewood Ranch is a 33,000-acre master-planned community spanning Manatee and Sarasota counties, east of I-75 between Bradenton and Sarasota. It contains more than 30 separate neighborhoods called villages, two town centers, 150+ miles of trails and about 10,000 acres of lakes, parks and preserve.',
  },
  {
    id: 'is-lwr-a-city',
    category: 'Lakewood Ranch basics',
    question: 'Is Lakewood Ranch a city?',
    answer:
      'No. Lakewood Ranch is an unincorporated master-planned community, not a municipality. Addresses carry Bradenton, Lakewood Ranch or Sarasota mailing designations, and governance runs through Manatee or Sarasota county plus Community Development Districts and individual village HOAs.',
  },
  {
    id: 'lwr-ranking',
    category: 'Lakewood Ranch basics',
    question: 'Is Lakewood Ranch really the number one community in the country?',
    answer:
      'In RCLCO’s mid-year 2026 survey, Lakewood Ranch ranked No. 1 among multigenerational master-planned communities for the eighth consecutive year, with 1,035 sales. In overall national sales it ranks just behind The Villages. Both are real; the "No. 1" claim depends on which category is being measured.',
  },
  {
    id: 'how-many-villages',
    category: 'Lakewood Ranch basics',
    question: 'How many villages are in Lakewood Ranch?',
    answer:
      'More than 30 active villages, with new ones still being added in the southeast expansion. They range from 1990s resale villages like Summerfield to luxury enclaves like The Lake Club and Wild Blue, and 55+ communities like Del Webb and Cresswind.',
  },

  // ── Money ──
  {
    id: 'hoa-vs-cdd',
    category: 'Costs',
    question: 'What is the difference between HOA and CDD fees in Lakewood Ranch?',
    answer:
      'An HOA fee is a private association charge covering your village’s amenities, gates and common areas. A CDD (Community Development District) assessment repays the bonds that funded the infrastructure and is collected on your property tax bill. CDD is not optional and does not disappear when the HOA changes.',
  },
  {
    id: 'typical-hoa',
    category: 'Costs',
    question: 'How much are HOA fees in Lakewood Ranch?',
    answer:
      'Typically $100 to $650 per month, with most standard villages between $200 and $300. Bundled-golf club villages such as Esplanade can run $1,200–$1,800 a month, and parts of Wild Blue at Waterside exceed $1,100. Older villages like Summerfield can be under $60.',
  },
  {
    id: 'typical-cdd',
    category: 'Costs',
    question: 'How much are CDD fees in Lakewood Ranch?',
    answer:
      'Most homes pay roughly $1,200 to $4,500 a year, with many villages in the $1,500–$3,500 range. Older villages — Country Club, Country Club East, Central Park, Greenbrook — have partially or fully retired their bonds, so they pay less. Waterside, Azario and The Woodlands carry full debt service.',
  },
  {
    id: 'total-monthly',
    category: 'Costs',
    question: 'What do HOA and CDD cost together in Lakewood Ranch?',
    answer:
      'Combined, they commonly add $300 to over $1,200 per month on top of a mortgage, and the spread between villages is large. Always price the total carrying cost of a specific address rather than comparing list prices between villages.',
  },
  {
    id: 'property-taxes',
    category: 'Costs',
    question: 'What are property taxes like in Manatee and Sarasota counties?',
    answer:
      'Manatee County’s total millage was about 17.29 in the 2025 cycle; Sarasota County’s was about 13.48. As worked examples, a homesteaded $350,000 home runs roughly $5,350 a year in Manatee and roughly $4,185 in Sarasota. CDD assessments are billed on top of this.',
  },
  {
    id: 'insurance-cost',
    category: 'Costs',
    question: 'How much is homeowners insurance in Lakewood Ranch?',
    answer:
      'Florida averaged about $7,136 a year for $300,000 of dwelling coverage in 2026 — the highest in the nation — with a typical range of $5,500 to $11,000. Inland Lakewood Ranch generally prices better than barrier-island addresses. Expect a separate hurricane deductible of 2–5% of dwelling coverage. Get a quote before you go under contract.',
  },
  {
    id: 'no-income-tax',
    category: 'Costs',
    question: 'Does Florida have a state income tax?',
    answer:
      'No. Florida has no state income tax on wages, retirement income, Social Security or investment gains. For a household earning $150,000 that is roughly $7,000–$10,000 a year versus a high-tax state — though higher insurance and property costs offset part of the gain.',
  },
  {
    id: 'homestead',
    category: 'Costs',
    question: 'How does the Florida homestead exemption work?',
    answer:
      'If the home is your permanent residence on January 1, you can file with your county property appraiser by March 1 for that tax year. For 2026 the exemption totals $51,411. It also triggers the Save Our Homes cap, limiting annual assessed-value increases, and up to $500,000 of that benefit is portable to your next Florida home.',
  },

  // ── Buying ──
  {
    id: 'median-price',
    category: 'Buying',
    question: 'What is the median home price in Lakewood Ranch?',
    answer:
      'About $599,000 as of the most recent 2026 data, up roughly 1.7% year over year. The spread by area is wide: the established core around The Lake Club and Country Club East runs near a $750,000 median, while northwest Lakewood Ranch sits closer to $495,000.',
  },
  {
    id: 'cheapest-village',
    category: 'Buying',
    question: 'What is the most affordable village in Lakewood Ranch?',
    answer:
      'For new construction, Solera and Star Farms have the lowest entry points, with townhomes and smaller single-family homes starting in the $340Ks. For resale, Summerfield and Greenbrook offer the lowest cost of entry inside the 34202 ZIP, though the homes are 20–30 years old.',
  },
  {
    id: 'new-vs-resale',
    category: 'Buying',
    question: 'Should I buy new construction or resale in Lakewood Ranch?',
    answer:
      'New construction currently carries strong builder incentives — rate buydowns, closing credits and upgrade packages — but newer villages also carry full CDD bond debt, so your monthly carrying cost is higher. Resale in an older village usually means lower assessments, mature landscaping, and a maintenance budget. Compare total monthly cost, not list price.',
  },
  {
    id: 'builder-agent',
    category: 'Buying',
    question: 'Do I need a real estate agent to buy new construction?',
    answer:
      'You are not required to have one, but you should register your agent on your first visit to a builder’s sales center. The salesperson in the model home represents the builder. Builders typically pay buyer-agent compensation from their marketing budget, so going unrepresented rarely gets you a discount — it just removes your advocate.',
  },
  {
    id: 'how-long-build',
    category: 'Buying',
    question: 'How long does it take to build a home in Lakewood Ranch?',
    answer:
      'Production builders generally quote roughly 8–14 months from contract to closing depending on plan and phase. Custom and luxury builds in villages like The Lake Club and Wild Blue more commonly run 14–24 months. Standing inventory homes can close in 30–60 days.',
  },

  // ── Schools ──
  {
    id: 'lwr-schools-good',
    category: 'Schools',
    question: 'Are the schools in Lakewood Ranch good?',
    answer:
      'Broadly yes, and the area is one of the main reasons families move here. Lakewood Ranch High School holds an A- Niche grade with a reported 97% graduation rate; B.D. Gullett Elementary rates 8/10 on GreatSchools. Ratings vary by school, so check the specific assigned school rather than assuming.',
  },
  {
    id: 'which-school',
    category: 'Schools',
    question: 'Which school will my child attend in Lakewood Ranch?',
    answer:
      'It depends on your exact address, not your village. Manatee County addresses are assigned by the School District of Manatee County; Waterside and other Sarasota County addresses by Sarasota County Schools — currently Tatum Ridge Elementary, McIntosh Middle and Booker High. Boundaries change, so confirm with the district before you buy.',
  },
  {
    id: 'enroll-school',
    category: 'Schools',
    question: 'What do I need to enrol my child in a Florida school?',
    answer:
      'Proof of residency, a certified birth certificate or passport, a Florida Certification of Immunization (form DH 680), a school physical dated within the last 12 months, and records from the previous school. Out-of-state immunisation records must be transferred onto the Florida DH 680 form by a Florida provider or the county health department.',
  },
  {
    id: 'school-choice',
    category: 'Schools',
    question: 'Are there charter or private school options in Lakewood Ranch?',
    answer:
      'Yes. Lakewood Ranch Preparatory Academy is a tuition-free K–12 public charter offering Dual Diploma, AP Capstone and Cambridge AICE pathways. The Out-of-Door Academy runs its Upper School on the Uihlein campus in Lakewood Ranch. Both are application-based; apply early as waitlists are common.',
  },

  // ── Moving ──
  {
    id: 'driver-license',
    category: 'Moving to Florida',
    question: 'How long do I have to get a Florida driver license after moving?',
    answer:
      'Thirty days from establishing residency for your license, and ten days for vehicle titling and registration. You must apply in person at a county tax collector office that offers driver license services. You will take a vision test, but as an existing license holder you are usually exempt from written and road tests.',
  },
  {
    id: 'car-registration',
    category: 'Moving to Florida',
    question: 'How do I register my car in Florida?',
    answer:
      'First get Florida insurance from a Florida-licensed agent — out-of-state coverage will not work. Then bring the title, proof of insurance, your ID and a completed VIN verification to a county tax collector office within ten days of establishing residency. Budget for initial registration fees, which are higher than most states.',
  },
  {
    id: 'best-time-move',
    category: 'Moving to Florida',
    question: 'When is the best time of year to move to Lakewood Ranch?',
    answer:
      'Late spring through summer is easiest logistically: movers cost less, traffic is lighter, and you can settle before the school year. Buying in the off-season often means less competition too. The trade-off is moving in the heat and the peak of hurricane season.',
  },
  {
    id: 'hurricanes',
    category: 'Moving to Florida',
    question: 'Do I need to worry about hurricanes in Lakewood Ranch?',
    answer:
      'It is a genuine consideration, but Lakewood Ranch sits inland east of I-75, well away from the coastal storm-surge zones that cause most hurricane damage and evacuation orders. Check the specific FEMA flood zone and evacuation level for any address, and expect a separate hurricane deductible on your insurance.',
  },

  // ── Lifestyle ──
  {
    id: 'closest-beach',
    category: 'Lifestyle',
    question: 'How far is Lakewood Ranch from the beach?',
    answer:
      'Roughly 20 to 45 minutes depending on the beach and the season. Coquina Beach on Anna Maria Island is typically the closest at around 35 minutes; Siesta Key Beach runs about 40; Lido Beach and St. Armands Circle about 35. Add time between January and April.',
  },
  {
    id: 'weather',
    category: 'Lifestyle',
    question: 'What is the weather like in Lakewood Ranch?',
    answer:
      'Humid subtropical: highs from about 72°F in January to 91°F in July and August, lows from about 52°F to 77°F. Sarasota records roughly 2,930–3,326 hours of sunshine a year, averaging about 6.5 hours of sun a day, with May the sunniest month at 10.5 hours daily.',
  },
  {
    id: 'things-to-do',
    category: 'Lifestyle',
    question: 'What is there to do in Lakewood Ranch?',
    answer:
      'Two town centers — Main Street and lakefront Waterside Place — with dining, a cinema, a Sunday farmers market and an amphitheatre; 150+ miles of trails; eight community parks; 54 holes of golf; and Premier Sports Campus. Sarasota’s arts scene, The Ringling and Selby Gardens are 20–25 minutes away.',
  },
  {
    id: 'happy-hour',
    category: 'Lifestyle',
    question: 'Where is the best happy hour in Lakewood Ranch?',
    answer:
      'Main Street has the densest cluster: Ed’s Tavern runs 4–7 PM daily with half-price appetizers, and GROVE runs 3–7 PM daily across all dining areas. At Waterside Place, Allswell and Agave Bandido both run 3–6 PM weekdays. Libby’s is all day Mondays and Tuesdays.',
  },
  {
    id: 'airport',
    category: 'Lifestyle',
    question: 'What airport do you use from Lakewood Ranch?',
    answer:
      'Sarasota Bradenton International (SRQ) is about 8 miles and 12 minutes away, and its nonstop network has grown substantially. Tampa International (TPA) is about 52 miles and 60–75 minutes north via I-75 and I-275, and is usually cheaper with far more routes.',
  },

  // ── Working with Caitlin ──
  {
    id: 'why-agent',
    category: 'Working together',
    question: 'Why work with a local agent instead of going direct to a builder?',
    answer:
      'Because the choice between 30+ villages, each with different assessments, build-out timelines, resale histories and school assignments, is the decision that actually costs or saves money — and a builder’s sales agent can only sell you their village. Representation is typically paid from the builder’s budget, so the advocacy costs you nothing extra.',
  },
  {
    id: 'out-of-state',
    category: 'Working together',
    question: 'Can you help if I am relocating from out of state?',
    answer:
      'Yes — most Lakewood Ranch buyers are. That usually means video tours, a shortlist built around your actual commute and school needs, and a planned visit where you see three or four villages in a day rather than driving aimlessly. Relocation logistics like licenses, registration and homestead filing are covered in the free guides on this site.',
  },
];

export const faqCategories = Array.from(new Set(FAQS.map((f) => f.category)));
export const faqsByCategory = (c: string) => FAQS.filter((f) => f.category === c);
export const faqsById = (ids: string[]) => FAQS.filter((f) => ids.includes(f.id));
