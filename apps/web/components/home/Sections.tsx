import Image from 'next/image';
import Link from 'next/link';
import {
  BadgeCheck, BadgeIndianRupee, Binoculars, Clock, Flower2, Gem, Headset, Heart, Landmark, MapPinned, Mountain,
  PartyPopper, Quote, ReceiptText, ShieldCheck, Ship, Sparkles, Star, Users, WalletCards, Zap, type LucideIcon,
} from 'lucide-react';
import {
  activities,
  DEAL_ENDS_AT,
  destinations,
  formatINR,
  MONTHS,
  packages,
  regions,
  reviews,
  stories,
  themes,
  valueProps,
} from '@/lib/content';
import { photo } from '@/lib/images';
import { Carousel } from '@/components/ui/Carousel';
import { Countdown } from '@/components/ui/Countdown';
import { Rating, SectionHeading } from '@/components/ui/Primitives';
import { PackageCard } from './PackageCard';

// Icon keys come from CMS data (themes, value props); unknown keys fall back to Sparkles.
const ICONS: Record<string, LucideIcon> = {
  Heart, Users, Mountain, Gem, Landmark, Flower2, PartyPopper, Binoculars, Ship,
  MapPinned, BadgeIndianRupee, ReceiptText, Headset, WalletCards, ShieldCheck,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Sparkles;
  return <C aria-hidden className={className} />;
}

/* 2 · Explore by region */
export function RegionTiles() {
  return (
    <section className="section container-av" aria-label="Explore by region">
      <SectionHeading eyebrow="Explore by region" title="Six regions, one continent of stories" subtitle="From island-hopping in the Andaman Sea to the Silk Road cities of Central Asia." action={{ label: 'All destinations', href: '/tour-packages' }} />
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 lg:gap-6">
        {regions.map((r) => {
          const p = photo(r.photo);
          return (
            <li key={r.slug}>
              <Link href="/tour-packages" className="group relative block aspect-[4/5] overflow-hidden rounded-card md:aspect-[4/3] lg:aspect-[16/10]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width:1280px) 389px, (min-width:1024px) 33vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/50 via-40% to-transparent to-75%" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white md:p-5">
                  <h3 className="font-display text-h4 text-white md:text-h3">{r.name}</h3>
                  <p className="mt-1 text-small text-white/90">
                    <span className="block md:inline">{r.countries} {r.countries === 1 ? 'country' : 'countries'}</span>
                    <span aria-hidden className="hidden md:inline"> · </span>
                    <span className="block md:inline">from <span className="font-semibold">{formatINR(r.from)}</span></span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 3 · Trending destinations */
export function TrendingDestinations() {
  return (
    <section className="section relative bg-ink-900" aria-label="Trending destinations">
      <Image src="/images/1.png" alt="" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-ink-900/75 via-ink-900/40 to-ink-900/60" />
      <div className="container-av relative">
        <SectionHeading tone="dark" eyebrow="Trending now" title="Where travellers are heading" action={{ label: 'See all', href: '/tour-packages' }} />
        <Carousel label="Trending destinations">
          {destinations.slice(0, 11).map((d) => {
            const p = photo(d.photo);
            return (
              <Link key={d.name} href={`/tour-packages?q=${encodeURIComponent(d.name)}`} className="group relative aspect-[3/4] w-[13.75rem] shrink-0 snap-start overflow-hidden rounded-card lg:w-[16.25rem]">
                <Image src={p.src} alt={p.alt} fill sizes="260px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-pill bg-surface/95 px-2.5 py-1 text-micro font-semibold text-ink-900">{d.packages} packages</span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-micro font-semibold uppercase tracking-wider text-white/85">{d.country}</p>
                  <h3 className="font-display text-h3 text-white">{d.name}</h3>
                  <p className="mt-1 text-small">from <span className="font-bold">{formatINR(d.from)}</span></p>
                </div>
              </Link>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}

/* 4 · Best-selling packages */
export function BestSellers() {
  const list = [...packages].sort((a, b) => (b.bookedThisWeek ?? 0) - (a.bookedThisWeek ?? 0)).slice(0, 6);
  return (
    <section id="packages" className="section container-av" aria-label="Best-selling packages">
      <SectionHeading eyebrow="Best sellers" title="Holiday packages travellers love" subtitle="Hotels, transfers, sightseeing and breakfast included. Flights optional." action={{ label: 'View all packages', href: '/tour-packages' }} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <PackageCard key={p.slug} pkg={p} />
        ))}
      </div>
    </section>
  );
}

/* 5 · Travel by theme */
export function ThemeChips() {
  return (
    <section className="section bg-primary-50" aria-label="Travel by theme">
      <div className="container-av">
        <SectionHeading eyebrow="Travel by theme" title="Trips for every kind of traveller" />
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
          {themes.map((t) => (
            <li key={t.slug}>
              <Link href={`/tour-packages?theme=${t.slug}`} className="group flex flex-col items-center gap-3 rounded-card bg-surface px-2 py-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover">
                <span className="grid h-12 w-12 place-items-center rounded-pill bg-primary-50 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon name={t.icon} className="h-6 w-6" />
                </span>
                <span className="text-small font-semibold text-ink-900">{t.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* 6 · Deals banner */
export function DealsBanner() {
  const p = photo('r_west');
  return (
    <section id="deals" className="section container-av" aria-label="Deals">
      <div className="relative overflow-hidden rounded-card bg-primary-800 text-white">
        <Image src={p.src} alt={p.alt} fill sizes="(min-width:1280px) 1216px, 100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800 via-primary-800/85 to-transparent" />
        <div className="relative grid gap-8 p-8 lg:grid-cols-2 lg:p-14">
          <div>
            <p className="inline-flex rounded-pill bg-gold px-3 py-1 text-micro font-bold uppercase text-ink-900">Winter Sale · limited period</p>
            <h2 className="mt-4 text-h1 text-white">Up to 30% off Asia holidays</h2>
            <p className="mt-3 max-w-md text-white/90">Early-bird savings on Japan cherry blossom, Cappadocia balloons and Maldives water villas. Pay just 25% to lock your price.</p>
            <Countdown to={DEAL_ENDS_AT} tone="dark" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/tour-packages" className="btn-cta">Grab the deal</Link>
              <Link href="/tour-packages?max=50000" className="inline-flex items-center rounded-pill border border-white/70 px-5 py-2.5 text-small font-semibold text-white hover:bg-white/10">Under ₹50,000</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7 · Things to do */
export function ThingsToDo() {
  return (
    <section id="things-to-do" className="section bg-surface" aria-label="Things to do">
      <div className="container-av">
        <SectionHeading eyebrow="Things to do" title="Tours, tickets & experiences" subtitle="Instant confirmation on most activities, with free cancellation up to 24 hours before." />
        <Carousel label="Things to do">
          {activities.map((a) => {
            const p = photo(a.photo);
            return (
              <article key={a.title} className="card w-[17.5rem] shrink-0 snap-start lg:w-[18.75rem]">
                <div className="relative aspect-[4/3]">
                  <Image src={p.src} alt={p.alt} fill sizes="300px" className="object-cover" />
                  <span className="absolute left-3 top-3 rounded-pill bg-surface/95 px-2.5 py-1 text-micro font-semibold text-ink-900">{a.city}</span>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-[3rem] font-body text-body font-bold leading-snug text-ink-900">{a.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-small text-ink-500">
                    <span className="inline-flex items-center gap-1"><Clock aria-hidden className="h-4 w-4" /> {a.duration}</span>
                    <Rating value={a.rating} count={a.reviews} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {a.instant && <span className="inline-flex items-center gap-1 rounded-pill bg-primary-50 px-2 py-0.5 text-micro font-semibold text-primary"><Zap aria-hidden className="h-3 w-3" /> Instant confirmation</span>}
                    {a.freeCancel && <span className="inline-flex items-center gap-1 rounded-pill bg-success-bg px-2 py-0.5 text-micro font-semibold text-success-text"><BadgeCheck aria-hidden className="h-3 w-3" /> Free cancellation</span>}
                  </div>
                  <p className="mt-3 text-small text-ink-500">from <span className="text-h4 font-bold text-ink-900">{formatINR(a.price)}</span> per person</p>
                </div>
              </article>
            );
          })}
        </Carousel>
      </div>
    </section>
  );
}

/* 8 · Why book with us */
export function WhyUs() {
  return (
    <section className="section container-av pb-0 lg:pb-0" aria-label="Why book with us">
      <SectionHeading eyebrow="Why AsiaVoyage" title="Travel with people who know Asia" />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {valueProps.map((v) => (
          <li key={v.title} className="flex gap-4 rounded-card border border-line bg-surface p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-pill bg-primary-50 text-primary">
              <Icon name={v.icon} className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-body text-body font-bold text-ink-900">{v.title}</h3>
              <p className="mt-1 text-small">{v.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* 10 · Seasonal picks */
export function SeasonalPicks() {
  const m = new Date().getMonth() + 1;
  const picks = destinations.filter((d) => d.bestMonths.includes(m)).slice(0, 4);
  return (
    <section className="section bg-surface" aria-label="Seasonal picks">
      <div className="container-av">
        <SectionHeading eyebrow="Seasonal picks" title={`Where to go in ${MONTHS[m - 1]}`} subtitle="Built from best-season data, so the weather is on your side." />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {picks.map((d) => {
            const p = photo(d.photo);
            return (
              <li key={d.name}>
                <Link href={`/tour-packages?q=${encodeURIComponent(d.name)}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-card">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 font-display text-h4 group-hover:text-primary">{d.name}</h3>
                  <p className="text-small text-ink-500">
                    Best: {d.bestMonths.map((b) => MONTHS[b - 1]!.slice(0, 3)).join(', ')} · from <span className="font-semibold text-accent-text">{formatINR(d.from)}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* 11 · Reviews */
export function Reviews() {
  return (
    <section className="section container-av" aria-label="Traveller reviews">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow mb-2">Traveller reviews</p>
          <h2 className="text-h2">Loved by travellers across India and beyond</h2>
          <p className="mt-2 text-micro text-ink-500">Sample reviews for this preview. Verified reviews are connected in Phase 3.</p>
        </div>
        <div className="flex items-center gap-4 rounded-card bg-surface px-6 py-4 shadow-card">
          <span className="font-display text-[2.75rem] font-bold leading-none text-ink-900">4.8</span>
          <div>
            <div className="flex">{Array.from({ length: 5 }, (_, i) => <Star key={i} aria-hidden className="h-4 w-4 fill-gold text-gold" />)}</div>
            <p className="mt-1 text-small text-ink-500">from 12,400+ reviews</p>
          </div>
        </div>
      </div>
      <ul className="grid gap-6 lg:grid-cols-3">
        {reviews.map((r) => {
          const p = photo(r.photo);
          return (
            <li key={r.name} className="card flex flex-col">
              <div className="relative aspect-[16/9]">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <Quote aria-hidden className="h-6 w-6 text-primary" />
                <p className="mt-2 flex-1 text-body">{r.body}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                  <div>
                    <p className="font-semibold text-ink-900">{r.name}</p>
                    <p className="text-micro text-ink-500">{r.trip}</p>
                  </div>
                  <Rating value={r.rating} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* 12 · Travel stories */
export function Stories() {
  return (
    <section className="section bg-surface" aria-label="Travel stories">
      <div className="container-av">
        <SectionHeading eyebrow="Travel stories" title="Guides from our destination experts" action={{ label: 'Read the blog', href: '/#stories' }} />
        <ul className="grid gap-6 md:grid-cols-3">
          {stories.map((s) => {
            const p = photo(s.photo);
            return (
              <li key={s.title}>
                <Link href="/#stories" className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-card">
                    <Image src={p.src} alt={p.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <p className="eyebrow mt-4">{s.tag} · {s.minutes} min read</p>
                  <h3 className="mt-1 font-display text-h4 leading-snug group-hover:text-primary">{s.title}</h3>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* 13 · Partners & payments */
export function Partners() {
  const items = ['UPI', 'Visa', 'Mastercard', 'RuPay', 'American Express', 'Apple Pay', 'Google Pay', 'No-cost EMI'];
  return (
    <section className="border-y border-line bg-surface-warm py-10" aria-label="Payment partners">
      <div className="container-av flex flex-col items-center gap-5 lg:flex-row lg:justify-between">
        <p className="text-small font-semibold text-ink-900">Pay your way, securely</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {items.map((i) => (
            <li key={i} className="rounded-md border border-line bg-surface px-4 py-2 text-small font-semibold text-ink-600">{i}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
