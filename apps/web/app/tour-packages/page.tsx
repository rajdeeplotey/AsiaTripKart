import type { Metadata } from 'next';
import Link from 'next/link';
import { matchesQuery, packages, themes } from '@/lib/content';
import { PackageCard } from '@/components/home/PackageCard';

export const metadata: Metadata = {
  title: 'Asia Tour Packages',
  description: 'Compare holiday packages across Asia by destination, theme and budget.',
};

type Search = { q?: string; theme?: string; max?: string };

// Minimal listing so header and hero search have somewhere to land. Full filter rail, sort and map arrive in Phase 2.
export default async function TourPackagesPage({ searchParams }: { searchParams: Promise<Search> }) {
  const { q, theme, max } = await searchParams;
  const maxPrice = max ? Number(max) : undefined;
  const results = packages.filter(
    (p) => matchesQuery(p, q) && (!theme || p.themes.includes(theme)) && (!maxPrice || p.price <= maxPrice),
  );
  const themeName = themes.find((t) => t.slug === theme)?.name;
  const heading = [themeName, q ? `${q[0]!.toUpperCase()}${q.slice(1)}` : 'Asia'].filter(Boolean).join(' ');

  return (
    <div className="container-av py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="text-small text-ink-500">
        <Link href="/" className="hover:text-primary">Home</Link> <span aria-hidden>/</span> Tour packages
      </nav>
      <h1 className="mt-3 text-h1">{heading} tour packages</h1>
      <p className="mt-2">
        {results.length} {results.length === 1 ? 'package' : 'packages'}
        {maxPrice ? ` under ₹${maxPrice.toLocaleString('en-IN')}` : ''}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Filter by theme">
        <li>
          <Link href={q ? `/tour-packages?q=${encodeURIComponent(q)}` : '/tour-packages'} className={`inline-block rounded-pill border px-4 py-1.5 text-small font-semibold ${!theme ? 'border-primary bg-primary text-white' : 'border-line-strong bg-surface text-ink-600 hover:border-primary hover:text-primary'}`}>
            All
          </Link>
        </li>
        {themes.map((t) => {
          const params = new URLSearchParams({ ...(q ? { q } : {}), theme: t.slug });
          const on = theme === t.slug;
          return (
            <li key={t.slug}>
              <Link href={`/tour-packages?${params}`} className={`inline-block rounded-pill border px-4 py-1.5 text-small font-semibold ${on ? 'border-primary bg-primary text-white' : 'border-line-strong bg-surface text-ink-600 hover:border-primary hover:text-primary'}`}>
                {t.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {results.length ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <PackageCard key={p.slug} pkg={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-card bg-surface p-10 text-center shadow-card">
          <h2 className="text-h3">No packages match yet</h2>
          <p className="mt-2">Tell us where you want to go and an expert will build a trip for you.</p>
          <Link href="/#plan-my-trip" className="btn-cta mt-6">Plan my trip</Link>
        </div>
      )}
    </div>
  );
}
