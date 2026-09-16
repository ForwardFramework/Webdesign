import { NextResponse } from 'next/server';
import { getDrive } from '@/lib/drive-times';
import { PLACES } from '@/data/places';
import { VILLAGES } from '@/data/villages';

export const runtime = 'nodejs';
export const revalidate = 1800;

/**
 * GET /api/drive-times?from=<villageSlug|lat,lng>&to=<placeId,placeId,...>
 * Returns a drive estimate per destination, each tagged live | estimated.
 */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const fromRaw = sp.get('from') ?? '';
  const toRaw = sp.get('to') ?? '';

  let from = VILLAGES.find((v) => v.slug === fromRaw)?.coords;
  if (!from && /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(fromRaw)) {
    const [lat, lng] = fromRaw.split(',').map(Number);
    // Keep the proxy pointed at our own region; it is not a general routing API.
    if (lat > 26 && lat < 29 && lng > -83.5 && lng < -81.5) from = { lat, lng };
  }
  if (!from) return NextResponse.json({ error: 'Unknown origin' }, { status: 400 });

  const ids = toRaw.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 25);
  const targets = PLACES.filter((p) => ids.includes(p.id));

  const results = await Promise.all(
    targets.map(async (p) => ({ id: p.id, name: p.name, ...(await getDrive(from!, p.coords)) }))
  );

  return NextResponse.json(
    { origin: fromRaw, results },
    { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
  );
}
