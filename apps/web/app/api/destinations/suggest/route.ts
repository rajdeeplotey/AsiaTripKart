import { NextResponse, type NextRequest } from 'next/server';
import { mockDestinations } from '@/lib/mock-destinations';
import type { DestinationSuggestion } from '@/lib/search-types';

const MAX_RESULTS = 6;

// MOCK: GET /api/destinations/suggest?q= until the real backend is connected. An empty query returns popular destinations.
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';
  const items: DestinationSuggestion[] = mockDestinations
    .filter((d) => d.name.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS)
    .map(({ id, name, type, packageCount, imageUrl }) => ({ id, name, type, packageCount, imageUrl }));
  return NextResponse.json({ items });
}
