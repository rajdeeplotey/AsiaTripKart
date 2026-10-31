'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Camera, ChevronLeft, ChevronRight, Heart, Hotel, Plane, Car, Utensils } from 'lucide-react';
import { useState } from 'react';
import type { Inclusion, Package } from '@/lib/content';
import { photo } from '@/lib/images';
import { PriceBlock, Rating } from '@/components/ui/Primitives';

const INCLUSION = {
  hotel: { Icon: Hotel, label: 'Hotel' },
  meals: { Icon: Utensils, label: 'Meals' },
  transfers: { Icon: Car, label: 'Transfers' },
  sightseeing: { Icon: Camera, label: 'Sightseeing' },
  flights: { Icon: Plane, label: 'Flights (optional)' },
} satisfies Record<Inclusion, unknown>;

export function PackageCard({ pkg }: { pkg: Package }) {
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState(false);
  const p = photo(pkg.photos[i]!);
  const many = pkg.photos.length > 1;

  return (
    <article className="card group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image key={p.src} src={p.src} alt={p.alt} fill sizes="(min-width:1280px) 400px, (min-width:768px) 50vw, 100vw" className="animate-fade object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 top-0 z-[2] flex items-start justify-between p-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-pill bg-surface/95 px-2.5 py-1 text-micro font-bold text-ink-900">
              {pkg.nights}N/{pkg.nights + 1}D
            </span>
            {pkg.badge && <span className="rounded-pill bg-gold px-2.5 py-1 text-micro font-bold text-ink-900">{pkg.badge}</span>}
          </div>
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remove ${pkg.title} from wishlist` : `Save ${pkg.title} to wishlist`}
            onClick={() => setSaved((s) => !s)}
            className="grid h-9 w-9 place-items-center rounded-pill bg-surface/95 text-ink-900 shadow-card transition-transform hover:scale-105"
          >
            <Heart className={`h-[1.125rem] w-[1.125rem] ${saved ? 'fill-danger text-danger' : ''}`} />
          </button>
        </div>
        {many && (
          <>
            <div className="absolute inset-x-0 top-1/2 z-[2] flex -translate-y-1/2 justify-between px-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <button type="button" aria-label="Previous photo" onClick={() => setI((v) => (v - 1 + pkg.photos.length) % pkg.photos.length)} className="grid h-8 w-8 place-items-center rounded-pill bg-surface/90 text-ink-900">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Next photo" onClick={() => setI((v) => (v + 1) % pkg.photos.length)} className="grid h-8 w-8 place-items-center rounded-pill bg-surface/90 text-ink-900">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden>
              {pkg.photos.map((_, d) => (
                <span key={d} className={`h-1.5 rounded-pill bg-white transition-all ${d === i ? 'w-4' : 'w-1.5 opacity-70'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <Rating value={pkg.rating} count={pkg.reviews} />
          {pkg.bookedThisWeek && <span className="text-micro font-medium text-success-text">{pkg.bookedThisWeek} booked this week</span>}
        </div>
        <h3 className="mt-2 font-body text-[1.0625rem] font-bold leading-snug text-ink-900">
          <Link href="/tour-packages" className="after:absolute after:inset-0 focus:outline-none hover:text-primary">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-small text-ink-500">{pkg.route.map((r) => `${r.city} ${r.nights}N`).join(' → ')}</p>
        <ul className="mt-3 flex flex-wrap gap-3" aria-label="Included">
          {pkg.inclusions.map((k) => {
            const { Icon, label } = INCLUSION[k];
            return (
              <li key={k} className="flex flex-col items-center gap-1 text-[0.6875rem] text-ink-500" title={label}>
                <Icon aria-hidden className="h-[1.125rem] w-[1.125rem] text-primary" />
                {label.split(' ')[0]}
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <PriceBlock price={pkg.price} compareAt={pkg.compareAt} />
          <span className="btn-outline relative z-[1] shrink-0 px-4 py-2">View details</span>
        </div>
      </div>
    </article>
  );
}
