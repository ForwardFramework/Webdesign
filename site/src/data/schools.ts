import type { School } from './types';
import { RESEARCH_DATE } from './sources';

/**
 * Schools.
 *
 * `gsRating: null` means we did not find a current rating — NOT that the school
 * is unrated. The UI renders that as "check current rating" with a link, never
 * as a low score or a blank that reads like one.
 *
 * Attendance boundaries are set by the districts and change. Nothing here
 * assigns a school to an address; the village pages say so explicitly.
 */

const V = RESEARCH_DATE;

export const SCHOOLS: School[] = [
  // ── Manatee County — the Lakewood Ranch cluster ──
  {
    id: 'lakewood-ranch-high',
    name: 'Lakewood Ranch High School',
    level: 'High',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4285, lng: -82.4006 },
    gsRating: 6,
    nicheGrade: 'A-',
    website: 'https://www.greatschools.org/florida/bradenton/1817-Lakewood-Ranch-High-School/',
    notes:
      'AP plus Cambridge International (AICE) curriculum and a Gifted & Talented program. Reported 97% graduation rate, average GPA 3.59, average SAT 1190 / ACT 26.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['greatSchools', 'nicheLwrHigh'],
  },
  {
    id: 'bd-gullett-elementary',
    name: 'B.D. Gullett Elementary School',
    level: 'Elementary',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4262, lng: -82.3920 },
    gsRating: 8,
    nicheGrade: 'A-',
    website: 'https://www.greatschools.org/florida/bradenton/8002-B.D.-Gullett-Elementary-School/',
    notes: 'Performs above the Florida average for its grade levels. Serves several of the central and north-east villages.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['greatSchools'],
  },
  {
    id: 'dr-mona-jain-middle',
    name: 'Dr. Mona Jain Middle School',
    level: 'Middle',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4295, lng: -82.3885 },
    gsRating: null,
    website: 'https://www.greatschools.org/florida/e-bradenton/19000-DR-MONA-JAIN-MIDDLE-SCHOOL/',
    notes:
      'Reported as performing above the Florida average for its grade levels. One of the newer middle schools built for Lakewood Ranch growth.',
    confidence: 'reported',
    verifiedOn: V,
    sources: ['greatSchools'],
  },
  {
    id: 'r-dan-nolan-middle',
    name: 'R. Dan Nolan Middle School',
    level: 'Middle',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4494, lng: -82.4526 },
    gsRating: null,
    notes: 'Long-established Manatee middle school serving parts of the Lakewood Ranch corridor.',
    confidence: 'reported',
    verifiedOn: V,
    sources: ['greatSchools'],
  },
  {
    id: 'robert-willis-elementary',
    name: 'Robert E. Willis Elementary School',
    level: 'Elementary',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4478, lng: -82.4180 },
    gsRating: null,
    notes: 'Consistently listed among the top-ranked public elementary schools in Bradenton.',
    confidence: 'reported',
    verifiedOn: V,
    sources: ['greatSchools'],
  },
  {
    id: 'gilbert-mcneal-elementary',
    name: 'Gilbert W. McNeal Elementary School',
    level: 'Elementary',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4171, lng: -82.4090 },
    gsRating: null,
    notes: 'Serves several of the original Lakewood Ranch villages.',
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'braden-river-high',
    name: 'Braden River High School',
    level: 'High',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4595, lng: -82.4700 },
    gsRating: null,
    notes: 'The other main high school option for the corridor; frequently compared head-to-head with Lakewood Ranch High.',
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'braden-river-middle',
    name: 'Braden River Middle School',
    level: 'Middle',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4640, lng: -82.4740 },
    gsRating: null,
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'braden-river-elementary',
    name: 'Braden River Elementary School',
    level: 'Elementary',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4700, lng: -82.4790 },
    gsRating: null,
    confidence: 'reported',
    verifiedOn: V,
  },
  {
    id: 'carlos-haile-middle',
    name: 'Carlos E. Haile Middle School',
    level: 'Middle',
    type: 'Public',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4740, lng: -82.4450 },
    gsRating: null,
    confidence: 'reported',
    verifiedOn: V,
  },

  // ── Charter ──
  {
    id: 'lakewood-ranch-prep',
    name: 'Lakewood Ranch Preparatory Academy',
    level: 'K-12',
    type: 'Charter',
    district: 'School District of Manatee County',
    city: 'Bradenton',
    coords: { lat: 27.4405, lng: -82.3762 },
    gsRating: null,
    website: 'https://lakewoodranchprep.charterschoolsusa.com/learn-more',
    notes:
      'Tuition-free public charter, K–12 on one campus, opened August 2022 (Charter Schools USA). High schoolers can pursue a Dual Diploma, AP Capstone Diploma and Cambridge AICE Diploma. Enrollment is by application — apply early, waitlists are common.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['lwrPrep'],
  },

  // ── Private ──
  {
    id: 'out-of-door-academy',
    name: 'The Out-of-Door Academy — Uihlein (Upper School) Campus',
    level: 'K-12',
    type: 'Private',
    district: 'Independent',
    city: 'Lakewood Ranch',
    coords: { lat: 27.4110, lng: -82.4020 },
    gsRating: null,
    website: 'https://www.oda.edu/',
    notes:
      'Independent day school serving PK (age 4+) through Grade 12 across three Sarasota-area campuses, with the Upper School on the Uihlein campus in Lakewood Ranch. Tuition applies; apply a year ahead.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['oda'],
  },
  {
    id: 'saint-stephens',
    name: 'Saint Stephen’s Episcopal School',
    level: 'PK-8',
    type: 'Private',
    district: 'Independent',
    city: 'Bradenton',
    coords: { lat: 27.4880, lng: -82.6360 },
    gsRating: null,
    notes: 'Long-established independent school in west Bradenton, PK through Grade 12. A common option for families west of I-75.',
    confidence: 'reported',
    verifiedOn: V,
  },

  // ── Sarasota County — the Waterside assignment ──
  {
    id: 'tatum-ridge-elementary',
    name: 'Tatum Ridge Elementary School',
    level: 'Elementary',
    type: 'Public',
    district: 'Sarasota County Schools',
    city: 'Sarasota',
    coords: { lat: 27.3640, lng: -82.4030 },
    gsRating: null,
    notes:
      'Currently the assigned elementary school for the Waterside villages — about 6 miles from Waterside Place. Has earned U.S. News Best Elementary Schools recognition.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['sarasotaSchools'],
  },
  {
    id: 'mcintosh-middle',
    name: 'McIntosh Middle School',
    level: 'Middle',
    type: 'Public',
    district: 'Sarasota County Schools',
    city: 'Sarasota',
    coords: { lat: 27.3210, lng: -82.4870 },
    gsRating: null,
    notes: 'Currently the assigned middle school for the Waterside villages — about 7.6 miles from Waterside Place.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['sarasotaSchools'],
  },
  {
    id: 'booker-high',
    name: 'Booker High School',
    level: 'High',
    type: 'Public',
    district: 'Sarasota County Schools',
    city: 'Sarasota',
    coords: { lat: 27.3620, lng: -82.5390 },
    gsRating: null,
    notes:
      'Currently the assigned high school for the Waterside villages — about 11.8 miles from Waterside Place. Known regionally for its Visual & Performing Arts (VPA) magnet program.',
    confidence: 'verified',
    verifiedOn: V,
    sources: ['sarasotaSchools'],
  },
];

/**
 * The single most important sentence on the schools page. Sarasota County has
 * been actively re-evaluating whether to build new schools to serve Waterside,
 * so today's assignment is genuinely not a promise about next year's.
 */
export const SCHOOL_BOUNDARY_WARNING =
  'Attendance boundaries are set solely by the School District of Manatee County and Sarasota County Schools, and they change — Sarasota County has been actively reassessing the schools that serve Waterside. Never assume a village guarantees a school. Confirm the assignment for the exact address with the district before you write an offer.';

export const schoolsByType = (type: School['type']) => SCHOOLS.filter((s) => s.type === type);
export const schoolsByLevel = (level: School['level']) => SCHOOLS.filter((s) => s.level === level);
