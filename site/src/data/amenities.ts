/**
 * Structured community amenity tags.
 *
 * WHY THIS EXISTS SEPARATELY FROM `Village.amenities`:
 * `amenities` is human prose ("The Resort Club — pool, café & bar"). It reads
 * well and it is useless to filter on — "Resort pool & spa", "Heated resort
 * pool" and "Community pool & cabana" all mean the same thing to a buyer and
 * nothing to a string match. These tags are the machine-readable layer, derived
 * by hand from each village's own amenity list so the two can never disagree.
 *
 * TAGGING RULES — please keep to them when adding a village:
 *  • Only tag what that village's `amenities` prose actually supports. Do not
 *    infer "most villages have one" — a buyer filtering for a dog park and
 *    driving out to a village that has none is the exact failure to avoid.
 *  • `spa` means a full-service spa, NOT a hot tub attached to a pool. Several
 *    villages list "Resort pool & spa" meaning the latter; they are not tagged.
 *  • `restaurant` means food and drink served on site, not a nearby restaurant.
 *  • `walk-to-town-center` means genuinely walkable to Main Street or Waterside
 *    Place — not "a short drive", and not arriving by boat or shuttle.
 *  • When a village is still building, tag only what is open today.
 */

export const AMENITY_GROUPS = [
  'Pools & water',
  'Courts & sport',
  'Outdoors',
  'Fitness & wellness',
  'Social & dining',
  'Convenience',
] as const;

export type AmenityGroup = (typeof AMENITY_GROUPS)[number];

export interface AmenityDef {
  id: string;
  label: string;
  group: AmenityGroup;
  icon: string;
  /** Shown as a tooltip so a filter's meaning is never ambiguous. */
  hint: string;
}

export const AMENITIES = [
  // ── Pools & water ──
  { id: 'community-pool', label: 'Community pool', group: 'Pools & water', icon: '🏊', hint: 'A resort or community pool for residents.' },
  { id: 'lap-pool', label: 'Lap pool', group: 'Pools & water', icon: '🏊‍♂️', hint: 'A dedicated lap pool, separate from the resort pool.' },
  { id: 'splash-pad', label: 'Splash pad', group: 'Pools & water', icon: '💦', hint: 'Zero-depth water play for small children.' },
  { id: 'kayak-launch', label: 'Kayak / boat launch', group: 'Pools & water', icon: '🛶', hint: 'A launch for kayaks, canoes or small boats within the village.' },
  { id: 'lake-access', label: 'Lakes & water views', group: 'Pools & water', icon: '🌊', hint: 'Lake frontage or a meaningful number of water-view homesites.' },

  // ── Courts & sport ──
  { id: 'pickleball', label: 'Pickleball courts', group: 'Courts & sport', icon: '🎾', hint: 'Dedicated pickleball courts in the village.' },
  { id: 'tennis', label: 'Tennis courts', group: 'Courts & sport', icon: '🎾', hint: 'Tennis courts in the village or at its club.' },
  { id: 'basketball', label: 'Basketball courts', group: 'Courts & sport', icon: '🏀', hint: 'A basketball court in the village.' },
  { id: 'volleyball', label: 'Volleyball', group: 'Courts & sport', icon: '🏐', hint: 'Sand or hard-court volleyball.' },
  { id: 'bocce', label: 'Bocce', group: 'Courts & sport', icon: '⚪', hint: 'Bocce courts.' },
  { id: 'sports-fields', label: 'Sports fields', group: 'Courts & sport', icon: '⚽', hint: 'Open playing fields for soccer, baseball or similar.' },
  { id: 'golf', label: 'Golf course', group: 'Courts & sport', icon: '⛳', hint: 'A golf course in or attached to the village. Membership is usually separate — check what a specific home carries.' },

  // ── Outdoors ──
  { id: 'dog-park', label: 'Dog park', group: 'Outdoors', icon: '🐕', hint: 'A fenced dog park inside the village.' },
  { id: 'playground', label: 'Playground', group: 'Outdoors', icon: '🛝', hint: 'A children’s playground.' },
  { id: 'neighborhood-park', label: 'Neighborhood park', group: 'Outdoors', icon: '🌳', hint: 'A genuine park or village green, not just a pocket of landscaping.' },
  { id: 'trails', label: 'Walking trails', group: 'Outdoors', icon: '🚶', hint: 'Trails within the village, on top of the Ranch-wide network.' },
  { id: 'preserve', label: 'Preserve frontage', group: 'Outdoors', icon: '🦩', hint: 'Backs onto conservation or preserve land.' },

  // ── Fitness & wellness ──
  { id: 'fitness-center', label: 'Fitness center / gym', group: 'Fitness & wellness', icon: '💪', hint: 'A resident gym in the village.' },
  { id: 'fitness-classes', label: 'Group fitness classes', group: 'Fitness & wellness', icon: '🧘', hint: 'A studio running group classes, not just equipment.' },
  { id: 'spa', label: 'Full-service spa', group: 'Fitness & wellness', icon: '💆', hint: 'A real spa with treatments — not a hot tub beside the pool.' },

  // ── Social & dining ──
  { id: 'clubhouse', label: 'Clubhouse', group: 'Social & dining', icon: '🏛️', hint: 'A resident clubhouse or amenity center.' },
  { id: 'restaurant', label: 'Restaurant / bar on site', group: 'Social & dining', icon: '🍽️', hint: 'Food and drink served inside the village — you can walk to dinner.' },
  { id: 'coffee', label: 'Coffee bar / café', group: 'Social & dining', icon: '☕', hint: 'A coffee bar or café within the village amenity center.' },
  { id: 'lifestyle-director', label: 'Lifestyle / activities director', group: 'Social & dining', icon: '📅', hint: 'Someone whose job is filling the social calendar. The difference between a community with events and one without.' },
  { id: 'event-lawn', label: 'Event lawn / gathering space', group: 'Social & dining', icon: '🔥', hint: 'An event lawn, village green or fire-pit gathering area.' },
  { id: 'concierge', label: 'Concierge', group: 'Social & dining', icon: '🛎️', hint: 'Concierge services for residents.' },

  // ── Convenience ──
  { id: 'lawn-care', label: 'Lawn care included', group: 'Convenience', icon: '🌿', hint: 'Lawn or full landscape maintenance included in the fee — at least in some sections. Confirm for the specific address.' },
  { id: 'guard-gated', label: 'Guard-gated', group: 'Convenience', icon: '🛡️', hint: 'A staffed gate, not just a code-entry gate.' },
  { id: 'walk-to-town-center', label: 'Walk to a town center', group: 'Convenience', icon: '🚶‍♀️', hint: 'Genuinely walkable to Main Street or Waterside Place.' },
] as const satisfies readonly AmenityDef[];

export type AmenityTag = (typeof AMENITIES)[number]['id'];

export const AMENITY_BY_ID = Object.fromEntries(AMENITIES.map((a) => [a.id, a])) as Record<AmenityTag, AmenityDef>;

export const amenitiesInGroup = (g: AmenityGroup): readonly AmenityDef[] => AMENITIES.filter((a) => a.group === g);

export const amenityLabel = (id: string): string => AMENITY_BY_ID[id as AmenityTag]?.label ?? id;

/**
 * Amenity data is derived from each village's published amenity list, which
 * changes as communities build out. Surfaced wherever these filters appear.
 */
export const AMENITY_DISCLAIMER =
  'Amenity tags are derived from each village’s published amenity list and are a shortlisting tool, not a guarantee. Villages still under construction open amenities in phases — always ask which are finished and open today, not which appear in the renderings.';
