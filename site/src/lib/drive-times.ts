import type { LatLng } from '@/data/types';

/**
 * Drive times.
 *
 * Two modes, and the UI always says which one it is using:
 *
 *  1. REAL — Google Routes API, proxied server-side so the key never reaches
 *     the browser. Set GOOGLE_ROUTES_API_KEY to enable. Returns live,
 *     traffic-aware durations.
 *
 *  2. ESTIMATED — no key configured. Falls back to great-circle distance scaled
 *     by a road-circuity factor calibrated against the drive times we DID verify
 *     (LWR→SRQ ≈ 8 mi / 12 min; LWR→TPA ≈ 52 mi / 70 min). Clearly labeled as
 *     an estimate everywhere it appears, because pretending a straight-line
 *     approximation is a real route is how people miss flights.
 */

const R_MILES = 3958.8;

export function haversineMiles(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R_MILES * Math.asin(Math.sqrt(h));
}

/**
 * Road distance ≈ straight line × circuity. 1.25 is typical for a suburban grid;
 * crossing to the barrier islands is worse because you must use a bridge, so
 * anything heading materially west of the mainland gets a larger factor.
 */
function circuity(from: LatLng, to: LatLng): number {
  const crossesToIslands = to.lng < -82.56;
  const long = haversineMiles(from, to) > 35;
  if (crossesToIslands) return 1.55;
  if (long) return 1.2;
  return 1.3;
}

/** Average speed in mph, by trip length. Short trips are slower (lights, 25mph village roads). */
function avgSpeed(miles: number): number {
  if (miles < 4) return 24;
  if (miles < 10) return 33;
  if (miles < 25) return 42;
  return 52;
}

export interface DriveEstimate {
  miles: number;
  minutes: number;
  mode: 'live' | 'estimated';
}

export function estimateDrive(from: LatLng, to: LatLng): DriveEstimate {
  const miles = haversineMiles(from, to) * circuity(from, to);
  const minutes = Math.round((miles / avgSpeed(miles)) * 60);
  return { miles: Math.round(miles * 10) / 10, minutes: Math.max(minutes, 2), mode: 'estimated' };
}

/** Server-side only. Returns null when unconfigured so callers fall back cleanly. */
export async function fetchLiveDrive(from: LatLng, to: LatLng): Promise<DriveEstimate | null> {
  const key = process.env.GOOGLE_ROUTES_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters',
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: from.lat, longitude: from.lng } } },
        destination: { location: { latLng: { latitude: to.lat, longitude: to.lng } } },
        travelMode: 'DRIVE',
        routingPreference: 'TRAFFIC_AWARE',
      }),
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { routes?: { duration?: string; distanceMeters?: number }[] };
    const route = json.routes?.[0];
    if (!route?.duration) return null;
    const seconds = Number(String(route.duration).replace('s', ''));
    return {
      miles: Math.round(((route.distanceMeters ?? 0) / 1609.34) * 10) / 10,
      minutes: Math.max(1, Math.round(seconds / 60)),
      mode: 'live',
    };
  } catch {
    return null;
  }
}

export async function getDrive(from: LatLng, to: LatLng): Promise<DriveEstimate> {
  return (await fetchLiveDrive(from, to)) ?? estimateDrive(from, to);
}
