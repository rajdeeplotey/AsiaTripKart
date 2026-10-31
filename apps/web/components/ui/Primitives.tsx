import Link from 'next/link';
import { Star } from 'lucide-react';
import { discountPercent, formatINR } from '@/lib/content';

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  tone = 'light',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 [align-items:last_baseline] lg:mb-10">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow mb-2 ${dark ? 'text-white/90' : ''}`}>{eyebrow}</p>}
        <h2 className={`text-h2 ${dark ? 'text-white' : ''}`}>{title}</h2>
        {subtitle && <p className={`mt-3 text-body ${dark ? 'text-white/90' : 'text-ink-600'}`}>{subtitle}</p>}
      </div>
      {action && (
        <Link href={action.href} className={`text-small font-semibold underline-offset-4 hover:underline ${dark ? 'text-white' : 'text-primary'}`}>
          {action.label} →
        </Link>
      )}
    </div>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-small">
      <Star aria-hidden className="h-4 w-4 fill-gold text-gold" />
      <span className="font-semibold text-ink-900">{value.toFixed(1)}</span>
      {count !== undefined && <span className="text-ink-500">({count.toLocaleString('en-IN')})</span>}
      <span className="sr-only">out of 5</span>
    </span>
  );
}

export function PriceBlock({ price, compareAt, basis = 'per person' }: { price: number; compareAt?: number; basis?: string }) {
  return (
    <div>
      {compareAt && compareAt > price && (
        <div className="flex items-center gap-2">
          <s className="text-small text-ink-500">{formatINR(compareAt)}</s>
          <span className="rounded-pill bg-success-bg px-2 py-0.5 text-micro font-bold text-success-text">
            {discountPercent(price, compareAt)}% off
          </span>
        </div>
      )}
      <p className="text-h4 font-bold leading-tight text-ink-900">
        {formatINR(price)} <span className="text-micro font-medium text-ink-500">{basis}</span>
      </p>
    </div>
  );
}
