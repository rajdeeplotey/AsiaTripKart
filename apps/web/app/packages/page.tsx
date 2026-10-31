import { redirect } from 'next/navigation';
import { mockDestinations } from '@/lib/mock-destinations';

type Search = { destination?: string };

// HeroSearch submits to /packages. Until a results page exists, send visitors to the current listing page.
export default async function PackagesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { destination } = await searchParams;
  if (!destination) redirect('/tour-packages');
  const known = mockDestinations.find((d) => d.id === destination);
  redirect(`/tour-packages?${known ? known.listingQuery : `q=${encodeURIComponent(destination.replaceAll('-', ' '))}`}`);
}
