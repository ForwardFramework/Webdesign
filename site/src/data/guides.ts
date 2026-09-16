/**
 * Relocation guides.
 *
 * Each guide is published IN FULL on the page. The lead capture offers the
 * printable/checklist version, not the information itself — gating facts people
 * need in order to move house would be both hostile and terrible SEO.
 */

export interface GuideStep {
  title: string;
  detail: string;
  deadline?: string;
}

export interface GuideSection {
  heading: string;
  body?: string;
  bullets?: string[];
  steps?: GuideStep[];
  callout?: { tone: 'tip' | 'warning' | 'money'; title: string; body: string };
}

export interface Guide {
  slug: string;
  title: string;
  subtitle: string;
  promise: string;
  readingTime: string;
  emoji: string;
  intro: string;
  sections: GuideSection[];
  updated: string;
}

const UPDATED = '2026-09-16';

export const GUIDES: Guide[] = [
  {
    slug: 'florida-relocation-playbook',
    title: 'The Florida Relocation Playbook',
    subtitle: 'Driver licenses, plates, voter registration, homestead — in the order you actually have to do them',
    promise: 'A dated, deadline-by-deadline checklist for your first 30 days as a Florida resident.',
    readingTime: '9 min',
    emoji: '🚗',
    updated: UPDATED,
    intro:
      'Florida gives you two clocks the moment you establish residency, and they run at different speeds: ten days for your vehicles, thirty days for your license. Almost everyone discovers this in the wrong order, because the vehicle deadline is the tighter one and nobody mentions it. Here is the sequence that works.',
    sections: [
      {
        heading: 'The two deadlines nobody warns you about',
        body:
          'Establishing residency in Florida starts two separate countdowns. Missing them is not catastrophic, but it is avoidable, and the fix is annoying.',
        steps: [
          {
            title: 'Vehicle title, registration and plates',
            detail:
              'You must title and register each vehicle within 10 days of establishing residency. Crucially, you cannot do this without Florida insurance first — see the next step.',
            deadline: '10 days',
          },
          {
            title: 'Florida driver license',
            detail:
              'You must obtain a valid Florida driver license within 30 days of establishing residency in order to drive on Florida roads.',
            deadline: '30 days',
          },
        ],
        callout: {
          tone: 'warning',
          title: 'Do the insurance first',
          body:
            'Florida requires coverage from an agent licensed to sell insurance in Florida. Your existing out-of-state policy will not satisfy the requirement, and you cannot register the car without it. Start the insurance conversation before the moving truck arrives — this is the single most common thing that derails week one.',
        },
      },
      {
        heading: 'Step 1 — Florida auto insurance',
        body:
          'Call a Florida-licensed agent and set up Personal Injury Protection (PIP) and Property Damage Liability coverage. Ask them to email you the Florida insurance card the same day; you need it in hand for the tax collector.',
        bullets: [
          'Use a Florida-licensed agent — your current carrier may be able to issue a Florida policy, but it must be a Florida policy.',
          'Ask for the Florida insurance ID card as a PDF immediately.',
          'Bundle the conversation with homeowners insurance if you are buying — the same agent can usually quote both, and Florida home premiums deserve real shopping.',
        ],
      },
      {
        heading: 'Step 2 — Vehicle title and registration',
        body:
          'In Florida this happens at the county tax collector, not at a DMV office. For Lakewood Ranch that means the Manatee County Tax Collector (or Sarasota County for Waterside addresses). Book an appointment online — walk-in waits can be hours.',
        bullets: [
          'Original out-of-state title (or a lien-holder letter if the title is held by a lender).',
          'Proof of Florida insurance.',
          'Your photo ID.',
          'A completed VIN verification — this can be done at the office, by a law-enforcement officer, or by a licensed Florida dealer.',
          'Payment. Florida’s initial registration fee is higher than most states; budget a few hundred dollars per vehicle beyond the plate cost.',
        ],
        callout: {
          tone: 'money',
          title: 'Budget for the initial registration fee',
          body:
            'Florida charges a one-time initial registration fee on a vehicle being registered in the state for the first time, on top of the plate and title fees. It surprises almost every new resident. It is per vehicle.',
        },
      },
      {
        heading: 'Step 3 — Florida driver license',
        body:
          'Also at the county tax collector, in person, by appointment. As of 2026 Florida has aligned fully with federal REAL ID standards, so the document requirements are strict and non-negotiable — bring originals, not copies or photos.',
        bullets: [
          'Primary identification: original birth certificate from the Bureau of Vital Statistics (or a state-issued certified copy), or a US passport or passport card.',
          'Proof of Social Security number: Social Security card, W-2, or a paystub showing the full number.',
          'TWO proofs of Florida residential address: utility bill, lease, mortgage statement, bank statement, or your Florida vehicle registration. They must show your name and the Florida address.',
          'If your name differs from your birth certificate: certified marriage certificates or court orders showing every name change in sequence.',
          'You will take a vision test. As an existing license holder in good standing, you are typically exempt from the written and road tests.',
        ],
        callout: {
          tone: 'tip',
          title: 'The name-chain trap',
          body:
            'REAL ID requires an unbroken documentary chain from your birth name to your current name. If you have married twice, you need both certificates. Missing one link means a wasted appointment — this is the number-one reason people get turned away.',
        },
      },
      {
        heading: 'Step 4 — Voter registration',
        body:
          'Register with the Supervisor of Elections in Manatee or Sarasota County. You can do it online, by mail, or at the tax collector office when you get your license — the last option saves a trip.',
      },
      {
        heading: 'Step 5 — Homestead exemption (the one that actually saves money)',
        body:
          'If the home is your permanent residence as of January 1, file for homestead with your county property appraiser by March 1 of that year. For 2026 the exemption totals $51,411 — the first $25,000 applies to all property taxes including school taxes; the remainder applies to assessed value between $50,000 and $75,000, excluding school taxes.',
        bullets: [
          'More valuable than the exemption itself: homestead triggers the Save Our Homes cap, limiting how fast your assessed value can rise each year.',
          'If you are moving within Florida, portability lets you transfer up to $500,000 of accrued Save Our Homes benefit to the new home. You must establish the new residence on or before January 1 of the third year after abandoning the old homestead.',
          'File online with the Manatee County or Sarasota County Property Appraiser. It is free — ignore any service that offers to file it for a fee.',
        ],
        callout: {
          tone: 'money',
          title: 'Do not miss March 1',
          body:
            'Miss the deadline and you wait a full year for the benefit, which on a Lakewood Ranch home is a four-figure mistake. Put it in your calendar the day you close.',
        },
      },
      {
        heading: 'Step 6 — Declaration of Domicile and the rest',
        bullets: [
          'File a Declaration of Domicile with the county Clerk of Court if you are leaving a state with income tax — it strengthens your case that Florida is your legal home.',
          'Update your address with the USPS, IRS, Social Security Administration, banks, and any professional licensing board.',
          'Move your estate documents. Wills, trusts and powers of attorney drafted in another state should be reviewed by a Florida attorney; Florida has its own rules, particularly around homestead property and personal representatives.',
          'Find a primary care physician and a dentist early — good practices in the Lakewood Ranch area book out, and establishing care before you need it is far easier.',
        ],
      },
    ],
  },
  {
    slug: 'enrolling-kids-florida-schools',
    title: 'Enrolling Your Kids in Florida Schools',
    subtitle: 'Manatee and Sarasota county requirements, the forms that trip people up, and how school assignment really works',
    promise: 'Every document, form number and deadline for getting your child enrolled without a second trip.',
    readingTime: '7 min',
    emoji: '🎒',
    updated: UPDATED,
    intro:
      'The paperwork itself is straightforward. What catches out-of-state families is that Florida will not accept your existing immunisation record as-is, and that your village name does not determine your school. Sort both of those before you arrive and enrollment takes one visit.',
    sections: [
      {
        heading: 'What you need to bring',
        body: 'Requirements are broadly the same in both districts. Bring originals.',
        bullets: [
          'Proof of residency — an electric bill, water bill, property tax bill, or a rental/lease agreement in the registering parent’s name.',
          'Birth date verification — a certified copy of the birth certificate, or a passport or certificate of arrival in the US.',
          'Immunisations on Florida form DH 680 (Florida Certification of Immunization). Required by Florida Statute 1003.22 for every student entering a Florida public school.',
          'A school physical examination dated within the last 12 months, signed and dated by a physician. Florida form DH 3040 is preferred; a comparable form from an out-of-state physician is usually accepted if it covers a complete review of body systems.',
          'Previous school records — report cards, transcripts, test results, and any IEP or 504 documentation.',
        ],
        callout: {
          tone: 'warning',
          title: 'The DH 680 is the one that gets people',
          body:
            'Your child’s out-of-state immunisation record is not the DH 680. A Florida-licensed physician or the county health department has to transcribe those records onto the Florida form. Book that appointment before you move, or the week you arrive — it is a small errand that can otherwise delay the first day of school.',
        },
      },
      {
        heading: 'Where to do it',
        bullets: [
          'Manatee County: School District of Manatee County handles registration; free immunisations are available to eligible children through the federally funded Vaccines for Children program at the Florida Department of Health in Manatee County.',
          'Sarasota County (including all Waterside addresses): register through Sarasota County Schools’ new-student registration process.',
        ],
      },
      {
        heading: 'How school assignment actually works',
        body:
          'This is the part that matters most when you are choosing a house, and the part most often got wrong. Your assigned school is determined by your exact street address, by the district — not by the village name, not by what a listing says, and not by what a model home sales agent tells you.',
        bullets: [
          'Manatee County addresses are assigned by the School District of Manatee County.',
          'Sarasota County addresses — which means every Waterside village — are assigned by Sarasota County Schools. That assignment has recently been Tatum Ridge Elementary (about 6 miles from Waterside Place), McIntosh Middle (7.6 miles) and Booker High (11.8 miles).',
          'Boundaries change as the community grows. Sarasota County has been actively reassessing whether to build new schools to serve Waterside, so today’s assignment is not a guarantee about next year’s.',
        ],
        callout: {
          tone: 'warning',
          title: 'Verify before you write an offer',
          body:
            'If a specific school matters to your family, confirm the assignment for the exact address directly with the district before you go under contract. Do not rely on a village reputation, a listing remark, or this website.',
        },
      },
      {
        heading: 'Beyond the assigned school',
        bullets: [
          'Lakewood Ranch Preparatory Academy — tuition-free public charter, K–12 on one campus, offering Dual Diploma, AP Capstone and Cambridge AICE pathways. Application-based with common waitlists.',
          'The Out-of-Door Academy — independent day school, PK (age 4+) through Grade 12, with its Upper School on the Uihlein campus in Lakewood Ranch.',
          'Both districts operate school-choice and magnet programs with their own application windows, typically opening months before the school year. Missing a window usually means waiting a full year.',
        ],
        callout: {
          tone: 'tip',
          title: 'Apply earlier than feels necessary',
          body:
            'Charter and choice applications open long before most relocating families have even picked a house. If a specific program matters, get the application in while you are still shopping — you can always decline a seat.',
        },
      },
    ],
  },
  {
    slug: 'hoa-cdd-decoder',
    title: 'The HOA & CDD Decoder',
    subtitle: 'Why two homes at the same price can cost $900 a month apart in Lakewood Ranch',
    promise: 'How to price the true monthly cost of any Lakewood Ranch address before you fall in love with it.',
    readingTime: '6 min',
    emoji: '🧾',
    updated: UPDATED,
    intro:
      'Two Lakewood Ranch homes, both listed at $650,000, can differ by more than $900 a month in carrying cost. The difference is almost never the mortgage. It is the stack of HOA dues, CDD assessments and — in club villages — mandatory membership. Understanding that stack is the most valuable twenty minutes you will spend house-hunting here.',
    sections: [
      {
        heading: 'The three layers',
        steps: [
          {
            title: 'HOA — your village association',
            detail:
              'A private association fee covering your village’s gates, pool, clubhouse, landscaping and common areas. Across Lakewood Ranch it typically runs $100–$650 a month, with most standard villages between $200 and $300. Bundled-golf villages such as Esplanade can run $1,200–$1,800; parts of Wild Blue at Waterside exceed $1,100.',
          },
          {
            title: 'CDD / Stewardship District — the infrastructure bond',
            detail:
              'A Community Development District assessment that repays the bonds which funded roads, utilities, drainage and amenities, collected on your property tax bill. Most homes pay roughly $1,200–$4,500 a year, with many villages in the $1,500–$3,500 range. It is not optional and it is not negotiable.',
          },
          {
            title: 'Club membership — only in some villages',
            detail:
              'Separate from both of the above. At the Lakewood Ranch Golf & Country Club, initiation plus dues can dwarf the association fee. Some villages carry mandatory bundled golf on the deed, meaning you pay whether or not you ever pick up a club.',
          },
        ],
      },
      {
        heading: 'Why the CDD varies so much between villages',
        body:
          'It comes down to how much of the bond has been paid off. Older villages have had decades of assessments retire the debt portion, leaving mostly ongoing operations and maintenance.',
        bullets: [
          'Bonds partially or fully retired: Country Club, Country Club East, Central Park, Greenbrook. Lower assessments.',
          'Carrying full debt service: Waterside, Azario, The Woodlands, and the newest southeast districts. Higher assessments.',
          'This is why a 2003 home in Summerfield and a 2024 home in Azario can have wildly different tax bills at similar values.',
        ],
        callout: {
          tone: 'money',
          title: 'The counter-intuitive part',
          body:
            'A newer, shinier village frequently costs more per month to hold than an older one at the same price — because you are still paying off its infrastructure. That does not make new construction a bad deal; it makes the list price a bad way to compare.',
        },
      },
      {
        heading: 'How to price a specific address properly',
        steps: [
          { title: 'Pull the actual tax bill', detail: 'The county property appraiser and tax collector sites show the real assessment for that parcel, including the CDD line. Never use a village average for a decision.' },
          { title: 'Get the HOA estoppel or budget', detail: 'Ask for the current budget, the reserve study and the last two years of dues history. Rising dues and thin reserves predict a special assessment.' },
          { title: 'Ask what the fee actually includes', detail: 'Lorraine Lakes bundles cable, internet and lawn care into a high-looking fee. Indigo includes full landscaping. Compare like for like or the cheap-looking village wins on paper and loses in practice.' },
          { title: 'Confirm any mandatory membership', detail: 'In club villages, get the membership category attached to that specific deed in writing — not a general description of the club.' },
          { title: 'Add it up monthly', detail: 'Mortgage + taxes + CDD ÷ 12 + HOA + club + insurance. That number, not the list price, is what you are actually choosing between.' },
        ],
      },
      {
        heading: 'What you get for it',
        body:
          'It is worth saying plainly: the fees buy something real. Lakewood Ranch maintains more than 150 miles of trails, about 10,000 acres of lakes, parks and preserve, eight community parks, and two town centers with active event programming. Villages that feel expensive on paper are often the ones where you use the amenities weekly. The goal is not the lowest fee — it is the fee you are actually getting value from.',
      },
    ],
  },
  {
    slug: 'new-construction-playbook',
    title: 'The New Construction Playbook',
    subtitle: 'How builder incentives really work in Lakewood Ranch — and the four mistakes that cost buyers the most',
    promise: 'How to read a builder incentive, what to negotiate, and when new construction beats resale.',
    readingTime: '8 min',
    emoji: '🏗️',
    updated: UPDATED,
    intro:
      'Builder incentives across Sarasota and Lakewood Ranch have been running at multi-year highs. That is genuinely good news for buyers — and it is also where the most money gets quietly lost, because an incentive is a negotiation, not a gift, and the headline number is rarely the real number.',
    sections: [
      {
        heading: 'What is actually on the table',
        bullets: [
          'Mortgage rate buydowns — often advertised into the ~4.99%–5.49% range on 30-year fixed loans through the builder’s preferred lender. Usually the most valuable single incentive.',
          'Closing cost credits — commonly $10,000–$30,000+, typically conditional on using the preferred lender and title company.',
          'Design center / upgrade allowances — structural or finish credits, sometimes bundled into "move-in ready" packages.',
          'Pool and outdoor living packages — appearing more often on completed spec homes that have been standing a while.',
          'Preferred lender bonuses stacked on the above. Total packages have been reported from roughly $15,000 to $50,000+ depending on community and inventory status.',
        ],
      },
      {
        heading: 'Mistake 1 — Taking the rate buydown without shopping the loan',
        body:
          'A buydown to 4.99% sounds unbeatable, and sometimes it is. But the preferred lender may price the loan itself higher — in fees, in margin, or in the rate you roll to. Get one independent quote and compare total cost over the years you actually expect to hold the home, not the teaser rate. Sometimes the builder wins by a mile. Sometimes it is a wash. You cannot know without the comparison, and the comparison costs you nothing.',
        callout: {
          tone: 'money',
          title: 'Compare the whole loan, not the rate',
          body:
            'Ask both lenders for a Loan Estimate on the same day for the same loan amount. It is a standardised form specifically so you can compare them line by line.',
        },
      },
      {
        heading: 'Mistake 2 — Not knowing the incentive is inventory-driven',
        body:
          'The largest incentives are almost always on standing inventory the builder wants off the books before a quarter closes — not on a to-be-built home you design from scratch. If you are flexible on finishes, timing your search to a builder’s quarter-end and looking at completed specs is where the real money is. If you want to choose everything, expect a smaller package and price accordingly.',
      },
      {
        heading: 'Mistake 3 — Walking into the sales center unrepresented',
        body:
          'This is the expensive one. The friendly agent in the model home works for the builder. Almost every Lakewood Ranch builder pays buyer-agent compensation out of their own marketing budget, which means going in alone does not get you a discount — it just removes the person whose job is to read the contract, the addenda, the warranty and the lot premium on your behalf.',
        callout: {
          tone: 'warning',
          title: 'Register your agent on visit one',
          body:
            'Most builders require your agent to be present or registered at your FIRST visit. Walk in alone "just to look" and you can permanently forfeit representation on that community. If you are even casually touring, bring your agent or register them first.',
        },
      },
      {
        heading: 'Mistake 4 — Ignoring the carrying cost of a brand-new village',
        body:
          'Newer villages carry full CDD bond debt service, which means higher annual assessments than an older village with a retired bond. A new build can be the better buy and still cost meaningfully more per month to hold. Run the total monthly number — mortgage, taxes, CDD, HOA, insurance — before comparing it to a resale.',
      },
      {
        heading: 'What to negotiate beyond price',
        bullets: [
          'Lot premium — often more negotiable than the base price, especially late in a phase.',
          'Structural options — cheaper now than retrofitting later, and the thing buyers most regret skipping.',
          'Extended warranty terms and the specific list of what is covered in years one, two and ten.',
          'Closing date flexibility, if your sale or lease has to line up.',
          'Who pays the CDD assessment in the closing year.',
        ],
      },
      {
        heading: 'When resale wins',
        body:
          'Resale usually beats new construction when you want mature landscaping, a retired CDD bond, a larger lot, or a home you can occupy in 45 days rather than 10 months. New construction usually wins on warranty, insurance premiums (newer roofs and current building codes price better in Florida), energy efficiency and the ability to get exactly the layout you want. Neither is the right answer in general. Both are the right answer for specific people.',
      },
    ],
  },
  {
    slug: 'village-finder',
    title: 'How to Choose Your Lakewood Ranch Village',
    subtitle: 'Thirty-plus villages, one honest framework for narrowing to three',
    promise: 'A decision framework that gets you from 30+ villages to a realistic shortlist of three.',
    readingTime: '7 min',
    emoji: '🗺️',
    updated: UPDATED,
    intro:
      'Most buyers arrive with a list of twelve villages and no way to rank them. The fix is to stop comparing villages and start ranking the four variables that actually differ between them. Almost everyone finds that two of the four matter enormously and the other two barely register — and that is your shortlist.',
    sections: [
      {
        heading: 'Variable 1 — Carrying cost tolerance',
        body:
          'This separates the field faster than anything else. Older villages with retired CDD bonds — Summerfield, Riverwalk, Greenbrook, Country Club — cost meaningfully less per month to hold than Waterside, Azario or The Woodlands at the same purchase price. If your budget is tight monthly rather than at closing, look older. If you have room monthly and want new, look east and south.',
      },
      {
        heading: 'Variable 2 — How much amenity you will actually use',
        body:
          'Be honest about this one. Lorraine Lakes runs a clubhouse with a restaurant, arcade, splash pad and indoor and outdoor fitness, and you pay for it every month. Central Park has a big green, a splash pad and two dog parks, and no pool. Neither is better. The question is only whether you will be there on a Tuesday in August.',
        bullets: [
          'Maximum amenity: Lorraine Lakes, Star Farms, Esplanade at Azario, Wild Blue.',
          'Solid middle: Mallory Park, Sapphire Point, Indigo, Arbor Grande, Shoreview.',
          'Parks-and-trails minimalism: Summerfield, Riverwalk, Greenbrook, Central Park.',
        ],
      },
      {
        heading: 'Variable 3 — Where you will actually be driving',
        body:
          'Lakewood Ranch is 55 square miles. Living in the far northeast and working in downtown Sarasota is a genuinely different life from living in Waterside and doing the same commute.',
        bullets: [
          'Closest to Main Street dining and cinema: Edgewater, Riverwalk, Summerfield, Country Club.',
          'Closest to Waterside Place, downtown Sarasota and the beaches: the Waterside villages — Lakehouse Cove, Shoreview, Emerald Landing, Bungalow Walk, Wild Blue.',
          'Closest to the 34211 school cluster: Mallory Park, Arbor Grande, Indigo, Harmony.',
          'Best value per square foot, longest drives: the northeast corridor — Star Farms, Lorraine Lakes, Solera, Sweetwater.',
        ],
      },
      {
        heading: 'Variable 4 — New, newish, or established',
        bullets: [
          'Brand new with incentives: Star Farms, Lorraine Lakes, Solera, Sapphire Point, Sweetwater, Azario, Wild Blue, Bungalow Walk, Cresswind.',
          'Recent resale, everything finished, no construction traffic: Mallory Park, Indigo, Arbor Grande, Polo Run, Savanna, Lakehouse Cove, Shoreview.',
          'Established with mature trees and low assessments: Summerfield, Riverwalk, Edgewater, Greenbrook, Country Club.',
        ],
        callout: {
          tone: 'tip',
          title: 'The under-rated factor: construction traffic',
          body:
            'Buying into a village that is still building means years of trucks, dust and phased amenities that open later than the rendering suggested. Ask which amenities are actually finished today — not which are planned. It is a fair question and a good builder will answer it straight.',
        },
      },
      {
        heading: 'Special cases',
        bullets: [
          '55+ buyers: Del Webb Lakewood Ranch (established, most active social calendar, on-site restaurant) and Cresswind Lakewood Ranch (newer, wellness-focused, still selling).',
          'Golf-first buyers: the Country Club villages for a traditional private club; Esplanade or Azario for bundled resort-club golf; Legacy Golf Club if you want to play without any membership at all.',
          'Luxury and custom: The Lake Club and Wild Blue at Waterside, with Stock, John Cannon and Lee Wetherington among the builders.',
          'Walkability: Bungalow Walk and Emerald Landing for Waterside Place; Edgewater and Riverwalk for Main Street.',
        ],
      },
      {
        heading: 'Then go see three, not twelve',
        body:
          'Once the four variables have narrowed you to three or four villages, spend a day driving them — ideally at the time of day you would actually be commuting, and once on a weekend. Villages read completely differently in person than on a site plan. Most buyers know within an hour.',
      },
    ],
  },
  {
    slug: 'hurricane-and-insurance',
    title: 'Hurricanes, Flood Zones & Florida Insurance',
    subtitle: 'The honest version — what inland Lakewood Ranch actually changes, and what it does not',
    promise: 'How to evaluate storm risk and insurance cost for a specific address before you commit.',
    readingTime: '6 min',
    emoji: '🌀',
    updated: UPDATED,
    intro:
      'Every relocating buyer asks about hurricanes, and most agents wave it away. It deserves a straight answer, because it is both less frightening and more expensive than people expect: the storm risk inland is genuinely lower than on the barrier islands, and the insurance bill is genuinely the highest in the country.',
    sections: [
      {
        heading: 'What being inland actually changes',
        body:
          'Lakewood Ranch sits east of I-75, several miles from the Gulf. Most catastrophic hurricane damage — and virtually all mandatory evacuation — is driven by storm surge, which is a coastal phenomenon. Inland addresses trade surge risk for wind risk, which modern Florida building codes address directly.',
        bullets: [
          'Homes built to post-2002 Florida Building Code standards are engineered for high wind loads, and homes built after the 2020 code update more so again.',
          'Evacuation levels are assigned by address. Much of Lakewood Ranch sits in the lowest-priority evacuation zones, while barrier-island addresses are first to go.',
          'Inland does not mean immune. Freshwater flooding from rainfall, and wind damage, are real and happen.',
        ],
        callout: {
          tone: 'warning',
          title: 'Check the specific address, not the community',
          body:
            'FEMA flood zone and county evacuation level are assigned parcel by parcel, and they vary within Lakewood Ranch — a lot backing onto a retention pond is not the same as one three streets over. Pull both before you write an offer. They are free and public.',
        },
      },
      {
        heading: 'What Florida insurance actually costs',
        body:
          'This is the number that surprises people, and it deserves a real figure rather than a shrug. Florida averaged about $7,136 a year for $300,000 of dwelling coverage in 2026 — the highest average in the nation — with a typical range of roughly $5,500 to $11,000.',
        bullets: [
          'Coastal counties pay two to three times what inland ones do for an identical home. This is one real, unglamorous argument for living in Lakewood Ranch and driving to the beach.',
          'Florida policies carry a SEPARATE hurricane deductible, typically 2–5% of dwelling coverage — on a $700,000 home that is $14,000–$35,000 out of pocket before coverage starts. It is not the same as your regular deductible.',
          'Roof age is the single biggest rating factor. A roof over roughly 15 years old can make a home difficult or expensive to insure at all, which is a real consideration on 1990s resale stock.',
          'Newer construction generally prices better — current code, new roof, and often wind-mitigation credits.',
        ],
        callout: {
          tone: 'money',
          title: 'Quote the insurance during your inspection period',
          body:
            'Not after closing. Get a bindable quote on the specific address while you still have the right to walk. An uninsurable roof discovered after closing is a genuinely serious problem, and it is entirely avoidable.',
        },
      },
      {
        heading: 'Flood insurance',
        body:
          'Standard homeowners policies do not cover flood. If the home sits in a FEMA Special Flood Hazard Area and you have a federally backed mortgage, flood insurance is required. Outside those zones it is optional — and often surprisingly cheap, which is why many inland Lakewood Ranch owners carry it anyway. Ask for a quote regardless of zone; the preferred-risk pricing outside high-hazard areas is frequently a few hundred dollars a year.',
      },
      {
        heading: 'Practical season habits',
        bullets: [
          'Hurricane season runs June 1 to November 30, with the genuine peak in August and September.',
          'Sign up for Manatee or Sarasota County emergency alerts the week you move in.',
          'Know your evacuation zone and have a plan you could execute in two hours.',
          'Most Florida homes here have impact glass or shutters. Confirm which, and that the shutters are complete and stored, during inspection.',
          'Keep a documented photo inventory of the house and contents. It makes any future claim dramatically easier.',
        ],
      },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
