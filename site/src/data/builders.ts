import type { Builder } from './types';
import { RESEARCH_DATE } from './sources';

/**
 * Builders and incentives.
 *
 * DELIBERATE DESIGN CHOICE: this file stores incentive PATTERNS, not headline
 * numbers, and every card renders the date it was checked plus a "verify today"
 * call to action.
 *
 * Reason: builder incentives change weekly and are quote-specific (they depend
 * on the homesite, the standing inventory, whether you use the preferred
 * lender, and when you close). A static "$50,000 off!" banner on a real estate
 * website is both stale within days and exactly the kind of claim FREC treats
 * as misleading advertising under Fla. Admin. Code 61J2-10.025(1).
 */

const CHECKED = RESEARCH_DATE;

export const INCENTIVE_CONTEXT = {
  checkedOn: CHECKED,
  headline: 'Builder incentives across Sarasota and Lakewood Ranch have been running at multi-year highs.',
  patterns: [
    {
      label: 'Mortgage rate buydowns',
      detail:
        'Often advertised into the ~4.99%–5.49% range on 30-year fixed loans, through the builder’s preferred lender. Usually the single most valuable incentive — and the one with the most conditions attached.',
    },
    {
      label: 'Closing cost credits',
      detail: 'Commonly $10,000–$30,000+, and frequently tied to using the preferred lender and title company.',
    },
    {
      label: 'Design centre / upgrade packages',
      detail: 'Structural or finish credits, sometimes bundled as "move-in ready" packages on standing inventory.',
    },
    {
      label: 'Pool and outdoor living packages',
      detail: 'Appearing more often on completed spec homes that have been standing.',
    },
    {
      label: 'Preferred lender bonuses',
      detail: 'Stacked on top of the above; total packages reported from roughly $15,000 to $50,000+ depending on community and inventory status.',
    },
  ],
  theCatch:
    'Incentives are almost always largest on standing inventory the builder wants off the books — not on a to-be-built home you design. They are also usually conditional on the preferred lender, which may not be your best overall rate once you compare. The honest move is to price the incentive AND an independent lender side by side.',
  whyAgent:
    'Register your REALTOR® on your FIRST visit to a builder’s sales centre. Almost every builder in Lakewood Ranch pays buyer-agent compensation from their own marketing budget, and the sales agent in that model home works for the builder — not for you. If you walk in unrepresented, you do not get a discount for it; you simply give up having someone on your side of the table reading the contract, the addenda and the warranty.',
};

export const BUILDERS: Builder[] = [
  {
    id: 'pulte',
    name: 'Pulte Homes / DiVosta',
    villages: ['Sapphire Point', 'Shoreview at Waterside', 'Mallory Park', 'Wild Blue at Waterside', 'Lakewood Ranch Southeast'],
    productTypes: ['Single-family', 'Villas'],
    priceFrom: 500000,
    incentivePattern: 'Rate buydowns and closing-cost credits through the preferred lender; strongest offers on standing inventory.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['builderIncentives', 'newConstructionGuide'],
  },
  {
    id: 'taylor-morrison',
    name: 'Taylor Morrison (Esplanade)',
    villages: ['Esplanade at Azario', 'Esplanade Golf & Country Club', 'Lakewood Ranch Southeast'],
    productTypes: ['Villas', 'Single-family', 'Estate homes'],
    priceFrom: 480000,
    incentivePattern: 'Design-centre credits and finance incentives; resort-club villages often bundle club initiation offers.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['builderIncentives', 'newConstructionGuide'],
  },
  {
    id: 'lennar',
    name: 'Lennar',
    villages: ['Lorraine Lakes', 'Savanna', 'Polo Run', 'Arbor Grande', 'Palm Grove'],
    productTypes: ['Townhomes', 'Villas', 'Single-family', 'Executive homes'],
    priceFrom: 350000,
    incentivePattern:
      'Everything’s Included® packaging rather than a design centre — incentives usually show up as price adjustments and finance credits. Villas at Lorraine Lakes have been advertised from around $200,000 at points in the cycle.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['builderIncentives', 'newConstructionGuide'],
  },
  {
    id: 'dr-horton',
    name: 'D.R. Horton / Emerald Homes',
    villages: ['Star Farms at Lakewood Ranch', 'Solera at Lakewood Ranch'],
    productTypes: ['Townhomes', 'Villas', 'Single-family', 'Executive homes'],
    priceFrom: 340000,
    incentivePattern:
      'Volume builder — competes hardest on price and finance incentives. Solera has been the lowest entry point for new construction on the Ranch, with homes advertised from around $350,000.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['builderIncentives', 'newConstructionGuide'],
  },
  {
    id: 'neal',
    name: 'Neal Communities / Neal Signature',
    villages: ['Central Park', 'Indigo', 'Country Club East', 'Lakewood Ranch Southeast'],
    productTypes: ['Villas', 'Single-family', 'Luxury'],
    incentivePattern: 'Regional family builder. Incentives tend to be quieter and more negotiable per-home than the national builders.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['newConstructionGuide'],
  },
  {
    id: 'toll-brothers',
    name: 'Toll Brothers',
    villages: ['The Isles at Lakewood Ranch', 'Lakewood Ranch Southeast'],
    productTypes: ['Single-family', 'Estate homes'],
    priceFrom: 750000,
    incentivePattern: 'Luxury tier — incentives more often appear as design-studio credits than price cuts.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['newConstructionGuide'],
  },
  {
    id: 'homes-by-westbay',
    name: 'Homes by WestBay',
    villages: ['Sweetwater at Lakewood Ranch'],
    productTypes: ['Single-family', 'Executive homes'],
    priceFrom: 500000,
    incentivePattern: 'Known for structural flexibility; incentives usually surface as finance credits plus options allowances.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['newConstructionGuide'],
  },
  {
    id: 'stock-development',
    name: 'Stock Development / Stock Signature Homes',
    villages: ['Wild Blue at Waterside', 'The Lake Club'],
    productTypes: ['Luxury single-family', 'Custom estates'],
    priceFrom: 1200000,
    incentivePattern: 'Luxury/custom — negotiation happens on specification and lot premium rather than advertised incentives.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'john-cannon',
    name: 'John Cannon Homes',
    villages: ['Wild Blue at Waterside', 'The Lake Club', 'Country Club East'],
    productTypes: ['Luxury custom'],
    incentivePattern: 'Custom builder — pricing is by specification. Expect no headline incentives.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'lee-wetherington',
    name: 'Lee Wetherington Homes',
    villages: ['Wild Blue at Waterside', 'The Lake Club', 'Country Club East'],
    productTypes: ['Luxury custom'],
    incentivePattern: 'Custom builder — pricing is by specification.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'dream-finders',
    name: 'Dream Finders Homes',
    villages: ['Bungalow Walk at Lakewood Ranch', 'Emerald Landing at Waterside'],
    productTypes: ['Townhomes', 'Cottages', 'Single-family'],
    priceFrom: 450000,
    incentivePattern:
      'Closing-cost credits and rate buydowns through preferred lenders have been a consistent feature at Bungalow Walk and Emerald Landing.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['builderIncentives'],
  },
  {
    id: 'kolter',
    name: 'Kolter Homes (Cresswind)',
    villages: ['Cresswind Lakewood Ranch'],
    productTypes: ['Villas', 'Single-family'],
    priceFrom: 400000,
    incentivePattern: '55+ specialist — incentives often bundled with club/lifestyle inclusions.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'mattamy',
    name: 'Mattamy Homes',
    villages: ['Harmony at Lakewood Ranch'],
    productTypes: ['Townhomes', 'Single-family'],
    priceFrom: 350000,
    incentivePattern: 'Competes at the attainable end; incentives are typically finance-led.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'homes-by-towne',
    name: 'Homes by Towne',
    villages: ['Lakehouse Cove at Waterside'],
    productTypes: ['Single-family', 'Villas'],
    incentivePattern: 'Village is largely built out — incentives now mostly a resale conversation.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
  },
  {
    id: 'david-weekley',
    name: 'David Weekley Homes',
    villages: ['Waterside'],
    productTypes: ['Single-family'],
    incentivePattern: 'Design-centre credits and finance incentives typical of the national builders.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['newConstructionGuide'],
  },
  {
    id: 'mi-homes',
    name: 'M/I Homes',
    villages: ['Waterside'],
    productTypes: ['Single-family'],
    incentivePattern: 'Finance-led incentives; strongest on completed inventory.',
    incentiveCheckedOn: CHECKED,
    confidence: 'reported',
    sources: ['newConstructionGuide'],
  },
];
