import { NextResponse, type NextRequest } from 'next/server';
import { mockCatalogue, mockDestinations } from '@/lib/mock-destinations';
import type { PackageCount } from '@/lib/search-types';

// MOCK: GET /api/packages/count?destination=&month=&travellers= until the real backend is connected.
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const destination = params.get('destination')?.trim().toLowerCase() ?? '';
  const months = params.get('month')?.split(',').filter(Boolean) ?? [];
  const travellers = Number(params.get('travellers')) || 2;

  const matches = destination
    ? mockDestinations.filter((d) => d.id === destination).concat(mockDestinations.filter((d) => d.id !== destination && d.name.toLowerCase().includes(destination))).slice(0, 1)
    : mockCatalogue;

  // Narrower searches return fewer packages, so the live count visibly responds to each field.
  const monthShare = months.length ? Math.min(1, 0.45 + months.length * 0.15) : 1;
  const groupShare = travellers > 6 ? 0.7 : 1;
  const count = matches.reduce((sum, d) => sum + Math.max(1, Math.round(d.packageCount * monthShare * groupShare)), 0);
  const minPrice = matches.length ? Math.min(...matches.map((d) => d.minPrice)) : 0;

  return NextResponse.json<PackageCount>({ count, minPrice });
}
