import { NextResponse } from 'next/server';
import { getListings } from '@/lib/mls';
import type { ListingQuery } from '@/lib/mls';

export const runtime = 'nodejs';
export const revalidate = 300;

const nums = (v: string | null) => (v ? Number(v) || undefined : undefined);
const list = (v: string | null) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : undefined);

export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;

  const query: ListingQuery = {
    villages: list(sp.get('villages')),
    cities: list(sp.get('cities')),
    minPrice: nums(sp.get('minPrice')),
    maxPrice: nums(sp.get('maxPrice')),
    minBeds: nums(sp.get('minBeds')),
    minBaths: nums(sp.get('minBaths')),
    minSqft: nums(sp.get('minSqft')),
    propertyTypes: list(sp.get('propertyTypes')),
    newConstruction: sp.get('newConstruction') === 'true' || undefined,
    pool: sp.get('pool') === 'true' || undefined,
    waterfront: sp.get('waterfront') === 'true' || undefined,
    maxHoa: nums(sp.get('maxHoa')),
    sort: (sp.get('sort') as ListingQuery['sort']) ?? 'newest',
    limit: Math.min(nums(sp.get('limit')) ?? 24, 60),
    offset: nums(sp.get('offset')) ?? 0,
  };

  const result = await getListings(query);
  return NextResponse.json(result, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  });
}
