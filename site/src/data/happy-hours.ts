import type { HappyHour, DayOfWeek } from './types';
import { RESEARCH_DATE } from './sources';

/**
 * Happy hour by day of week.
 *
 * RULE FOR THIS FILE: no venue appears with a day/time window unless that
 * window was found published. Restaurants change these constantly and a
 * confidently wrong "Tue 4–6" sends a family out for a deal that does not
 * exist. Venues we know run a happy hour but could not confirm the window for
 * live in `UNCONFIRMED_VENUES` below — listed, linked, not fabricated.
 *
 * Every card in the UI carries the checked-on date and a "confirm before you
 * go" line for exactly this reason.
 */

const V = RESEARCH_DATE;
const ALL: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const WEEKDAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri'];

export const HAPPY_HOURS: HappyHour[] = [
  {
    id: 'eds-tavern',
    venue: 'Ed’s Tavern',
    district: 'Main Street at Lakewood Ranch',
    city: 'Lakewood Ranch',
    coords: { lat: 27.3939, lng: -82.4321 },
    days: ALL,
    window: '4–7 PM daily',
    deals: ['Half-price appetizers', 'Deals on premium spirits', 'Craft beer specials', 'House wines by the glass'],
    cuisine: 'American sports tavern',
    website: 'https://edstavernfl.com/happy-hour-in-lakewood-ranch/',
    vibe: 'sports',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['edsTavern'],
  },
  {
    id: 'grove-lwr',
    venue: 'GROVE',
    district: 'Main Street at Lakewood Ranch',
    city: 'Lakewood Ranch',
    coords: { lat: 27.3931, lng: -82.4334 },
    days: ALL,
    window: '3–7 PM daily, all dining areas',
    deals: [
      'Tuna nachos $15',
      'Fish tacos $9',
      'Boneless tenders $10',
      'Brisket sliders $9',
      'Mussels & bleu $8',
      'Fried pickles $6',
      'Margherita flatbread $11',
      'Balsamic chips $5',
      '$2 off draft beer, wine by the glass & sangria',
    ],
    cuisine: 'New American',
    website: 'https://www.grovelwr.com/happy-hour',
    vibe: 'lively',
    confidence: 'verified',
    verifiedOn: V,
  },
  {
    id: 'libbys-lwr',
    venue: 'Libby’s Neighborhood Brasserie',
    district: 'Lakewood Ranch',
    city: 'Lakewood Ranch',
    coords: { lat: 27.3925, lng: -82.4362 },
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sun'],
    window: 'Wed–Fri & Sun 2–6 PM · Mon & Tue ALL DAY',
    deals: [
      '$7 small plates all through happy hour',
      'Arancini',
      'Soft pretzel',
      'Meatballs',
      'Sambal chicken bites',
      'Brussels sprouts',
      'Avocado egg rolls',
      'Truffle fries',
    ],
    cuisine: 'Modern American brasserie',
    website: 'https://www.eatatlibbys.com/happy-hour',
    vibe: 'upscale',
    confidence: 'verified',
    verifiedOn: V,
  },
  {
    id: 'hana-sushi',
    venue: 'Hana Sushi Lounge',
    district: 'Main Street at Lakewood Ranch',
    city: 'Lakewood Ranch',
    coords: { lat: 27.3940, lng: -82.4338 },
    days: ['sun', 'mon', 'tue', 'wed', 'thu'],
    window: 'Sun–Thu 4–7 PM',
    deals: ['$6 rolls: California, Tampa, Spicy Tuna, Arizona, Crunch, Eden, Philly'],
    cuisine: 'Sushi & Japanese',
    vibe: 'laid-back',
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'kitchen-social',
    venue: 'Kitchen Social',
    district: 'Lakewood Ranch / UTC',
    city: 'Lakewood Ranch',
    coords: { lat: 27.3888, lng: -82.4552 },
    days: WEEKDAYS,
    window: '"Social Hour" Mon–Fri 3–6 PM',
    deals: ['Bar bites & cocktail specials during Social Hour'],
    cuisine: 'New American',
    website: 'https://ourkitchensocial.com/bar/',
    vibe: 'upscale',
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'allswell-waterside',
    venue: 'Allswell',
    district: 'Waterside Place',
    city: 'Sarasota',
    address: '7500 Island Cove Ter',
    coords: { lat: 27.3700, lng: -82.4512 },
    days: WEEKDAYS,
    window: 'Mon–Fri 3–6 PM · plus Thu 7–10 PM patio wine',
    deals: ['Food & drink specials 3–6 PM', '50% off all full bottles of wine, Thursdays 7–10 PM on the patio', 'Weekend brunch 10 AM–2 PM'],
    cuisine: 'Gastropub & craft cocktails',
    website: 'https://allswellsarasota.com/menus/happy-hour',
    vibe: 'waterfront',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['allswell'],
  },
  {
    id: 'agave-bandido',
    venue: 'Agave Bandido',
    district: 'Waterside Place',
    city: 'Sarasota',
    address: '1550 Lakefront Dr',
    coords: { lat: 27.3691, lng: -82.4523 },
    days: WEEKDAYS,
    window: 'Mon–Fri 3–6 PM (bar areas only)',
    deals: ['Happy hour food & drink in bar areas', 'Tuesdays: half-price taco platters', 'Late-night bites', 'Live DJs on weekends'],
    cuisine: 'Contemporary Mexican & tequila bar',
    website: 'https://agavebandido.com/menu-happy-hour-lakewood-ranch',
    vibe: 'lively',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['watersideHappyHour'],
  },
  {
    id: 'geckos-lwr',
    venue: 'Gecko’s Grill & Pub',
    district: 'Bradenton / Lakewood Ranch area',
    city: 'Bradenton',
    coords: { lat: 27.4510, lng: -82.4640 },
    days: ALL,
    window: 'All day, every day',
    deals: ['"Happy Days" happy-hour pricing all day at the full bar'],
    cuisine: 'American grill & pub',
    website: 'https://geckosgrill.com/',
    vibe: 'family',
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'duvals-sarasota',
    venue: 'Duval’s Fresh. Local. Seafood.',
    district: 'Downtown Sarasota',
    city: 'Sarasota',
    coords: { lat: 27.3364, lng: -82.5400 },
    days: ALL,
    window: '3–6 PM and 9 PM–close',
    deals: ['Twice-daily happy hour', 'Raw bar & drink specials', 'Late-night window after 9 PM'],
    cuisine: 'Seafood',
    website: 'https://www.duvalsfreshlocalseafood.com/happy-hour',
    vibe: 'lively',
    confidence: 'reported',
    verifiedOn: V,
  },
];

/**
 * Venues that publish a happy hour we could not pin a current window to.
 * Listed honestly rather than guessed — each links to the source of truth.
 */
export const UNCONFIRMED_VENUES: {
  venue: string;
  district: string;
  cuisine: string;
  website?: string;
  note: string;
}[] = [
  {
    venue: 'Ruth’s Chris Steak House',
    district: 'Lakewood Ranch',
    cuisine: 'Steakhouse',
    website: 'https://m.ruthschris.com/happy-hour/fl/sarasota-lakewood-ranch-restaurant/7386',
    note: 'Runs a bar happy hour; times vary by location and season — check the location page.',
  },
  {
    venue: 'Cooper’s Hawk Winery & Restaurant',
    district: 'UTC / Sarasota',
    cuisine: 'Wine & American',
    note: 'Wine-focused bar specials; confirm current window with the restaurant.',
  },
  {
    venue: 'Korê Steakhouse',
    district: 'Waterside Place',
    cuisine: 'Korean steakhouse',
    website: 'https://watersideplace.com/tenant/kore/',
    note: 'Bar programme with specials; window not published at time of checking.',
  },
  {
    venue: 'Osteria 500',
    district: 'Waterside Place',
    cuisine: 'Italian',
    website: 'https://watersideplace.com/tenant/osteria-500/',
    note: 'Check the Waterside Place promos page for current offers.',
  },
  {
    venue: 'Forked at Waterside',
    district: 'Waterside Place',
    cuisine: 'Breakfast, lunch & cocktails',
    website: 'https://www.forkedeats.com/',
    note: 'Daytime-led menu; confirm whether a happy hour is running this season.',
  },
  {
    venue: 'Casa Maya',
    district: 'Main Street at Lakewood Ranch',
    cuisine: 'Mexican',
    website: 'https://casamayalwr.com/',
    note: 'Advertises happy hour specials and margaritas; window not published.',
  },
  {
    venue: 'Remy’s on Main',
    district: 'Main Street at Lakewood Ranch',
    cuisine: 'American bistro',
    note: 'Listed among Main Street happy-hour spots; confirm times directly.',
  },
  {
    venue: 'The Greyson',
    district: 'Lakewood Ranch',
    cuisine: 'Cocktail bar',
    website: 'https://greysonbar.com/',
    note: 'Cocktail-led bar; check current specials.',
  },
];

/** Grouped for the by-day tabs on /lifestyle/happy-hours. */
export const happyHoursForDay = (day: DayOfWeek) => HAPPY_HOURS.filter((h) => h.days.includes(day));

export const HAPPY_HOUR_DISCLAIMER =
  'Happy hour times, days and pricing change without notice — especially between season and off-season. Every entry shows the date it was last checked. Confirm with the restaurant before you make the drive.';
