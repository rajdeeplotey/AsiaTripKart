'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DEAL_ENDS_AT, formatINR, navigation, packages, type NavItem, type NavPromo } from '@/lib/content';
import { photo } from '@/lib/images';
import { Countdown } from '@/components/ui/Countdown';

const OPEN_INTENT_MS = 120;
const CLOSE_DELAY_MS = 250;

export function MegaMenu({ inverted, onOpenChange }: { inverted: boolean; onOpenChange: (open: boolean) => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  const open = useCallback(
    (id: string | null) => {
      setOpenId(id);
      onOpenChange(id !== null);
    },
    [onOpenChange],
  );

  useEffect(() => () => clearTimers(), []);

  const onTriggerEnter = (e: React.PointerEvent, item: NavItem) => {
    if (e.pointerType === 'touch') return; // touch uses tap
    clearTimers();
    if (!item.columns) {
      if (openId) closeTimer.current = setTimeout(() => open(null), CLOSE_DELAY_MS);
      return;
    }
    if (openId) open(item.id); // a panel is already open: swap instantly
    else openTimer.current = setTimeout(() => open(item.id), OPEN_INTENT_MS);
  };

  const onNavLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => open(null), CLOSE_DELAY_MS);
  };

  const onNavEnter = () => clearTimeout(closeTimer.current);

  const focusFirstLink = () => requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('a')?.focus());

  const onTriggerKeyDown = (e: React.KeyboardEvent, item: NavItem) => {
    if (!item.columns) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      clearTimers();
      open(item.id);
      focusFirstLink();
    }
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && openId) {
      const id = openId;
      open(null);
      triggerRefs.current[id]?.focus();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const links = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a') ?? []);
      const idx = links.indexOf(document.activeElement as HTMLElement);
      if (idx === -1) return;
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? Math.min(idx + 1, links.length - 1) : Math.max(idx - 1, 0);
      links[next]?.focus();
    }
  };

  // Esc anywhere closes; focus leaving the whole nav closes.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const id = openId;
        open(null);
        triggerRefs.current[id]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, open]);

  const active = navigation.find((n) => n.id === openId);

  return (
    <nav
      aria-label="Main"
      className="hidden h-full lg:block"
      onPointerEnter={onNavEnter}
      onPointerLeave={onNavLeave}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) open(null);
      }}
    >
      <ul className="flex h-full items-stretch gap-3 [font-family:var(--font-manrope)] xl:gap-[1.875rem]">
        {navigation.map((item) => {
          const isOpen = openId === item.id;
          const color = isOpen ? 'text-primary' : inverted ? 'text-[#F3EEE6] hover:text-white' : 'text-[#14110F] hover:text-primary';
          const ring = inverted ? 'focus-visible:outline-white' : 'focus-visible:outline-[#14110F]';
          const label = (
            <>
              {item.label}
              {item.columns && (
                <ChevronDown aria-hidden size={14} strokeWidth={2.2} className={`transition-transform duration-150 ease-in-out ${isOpen ? 'rotate-180' : ''}`} />
              )}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-center rounded-pill transition-transform duration-200 ease-standard ${
                  inverted && !isOpen ? 'bg-white' : 'bg-primary'
                } ${isOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
              />
            </>
          );
          const cls = `group relative flex h-full items-center gap-1 whitespace-nowrap text-[0.875rem] font-semibold transition-colors duration-200 xl:text-[0.9375rem] ${color} ${ring}`;
          return (
            <li key={item.id} className="h-full" onPointerEnter={(e) => onTriggerEnter(e, item)}>
              {item.columns ? (
                <button
                  ref={(el) => {
                    triggerRefs.current[item.id] = el;
                  }}
                  type="button"
                  className={cls}
                  aria-expanded={isOpen}
                  aria-controls={`panel-${item.id}`}
                  aria-haspopup="true"
                  onKeyDown={(e) => onTriggerKeyDown(e, item)}
                  onClick={(e) => {
                    // Mouse users already opened it on hover; clicks (touch / pen) toggle.
                    if (e.detail === 0) return; // keyboard-synthesised click handled in onKeyDown
                    clearTimers();
                    open(isOpen ? null : item.id);
                  }}
                >
                  {label}
                </button>
              ) : (
                <Link href={item.href} className={cls}>
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {active?.columns && (
        <div className="absolute inset-x-0 top-full z-megamenu px-4" onKeyDown={onPanelKeyDown}>
          <div
            key={active.id}
            ref={panelRef}
            id={`panel-${active.id}`}
            className="animate-panel mx-auto grid max-w-megamenu grid-cols-[1fr_1fr_1fr_1.15fr] gap-8 rounded-card border border-line bg-surface p-8 shadow-panel"
          >
            {active.columns.map((col) => (
              <div key={col.heading}>
                <p className="eyebrow mb-4">{col.heading}</p>
                <ul className="space-y-1">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="group/link -mx-2 flex items-center gap-2 rounded-sm px-2 py-1.5 text-small text-ink-900 transition-colors hover:bg-surface-warm hover:text-primary"
                        onClick={() => open(null)}
                      >
                        {l.flag && <span aria-hidden className="text-base leading-none">{l.flag}</span>}
                        <span className="font-medium">{l.label}</span>
                        {l.badge && (
                          <span
                            className={`rounded-pill px-1.5 py-0.5 text-[0.625rem] font-bold uppercase leading-none ${
                              l.badge === 'hot' ? 'bg-accent-text text-white' : 'bg-gold text-ink-900'
                            }`}
                          >
                            {l.badge}
                          </span>
                        )}
                        {l.from && (
                          <span className="ml-auto text-micro text-ink-500 opacity-0 transition-opacity group-hover/link:opacity-100 group-focus-visible/link:opacity-100">
                            from <span className="font-semibold text-accent-text">{formatINR(l.from)}</span>
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Promo promo={active.promo} onNavigate={() => open(null)} />
          </div>
        </div>
      )}
    </nav>
  );
}

function Promo({ promo, onNavigate }: { promo?: NavPromo; onNavigate: () => void }) {
  if (!promo) return null;
  if (promo.kind === 'card') {
    const p = photo(promo.photo);
    return (
      <Link href={promo.href} onClick={onNavigate} className="group/promo relative block min-h-[15rem] overflow-hidden rounded-card">
        <Image src={p.src} alt={p.alt} fill sizes="300px" className="object-cover transition-transform duration-500 group-hover/promo:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/95 via-ink-900/50 to-ink-900/0" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="inline-block rounded-pill bg-gold px-2 py-0.5 text-micro font-bold uppercase text-ink-900">{promo.title}</p>
          <p className="mt-2 font-display text-h4 text-white">{promo.subtitle}</p>
          <p className="mt-2 text-small">
            Starts @ <span className="font-bold">{formatINR(promo.from)}</span>
          </p>
        </div>
      </Link>
    );
  }
  if (promo.kind === 'carousel') return <PromoCarousel title={promo.title} slugs={promo.packageSlugs} onNavigate={onNavigate} />;
  return (
    <Link href={promo.href} onClick={onNavigate} className="flex flex-col justify-between rounded-card bg-primary p-6 text-white">
      <div>
        <p className="text-micro font-semibold uppercase tracking-wider text-gold">Ends soon</p>
        <p className="mt-1 font-display text-h3 text-white">{promo.title}</p>
        <p className="mt-1 text-small text-white/90">{promo.subtitle}</p>
      </div>
      <Countdown to={promo.endsAt ?? DEAL_ENDS_AT} tone="dark" />
    </Link>
  );
}

function PromoCarousel({ title, slugs, onNavigate }: { title: string; slugs: string[]; onNavigate: () => void }) {
  const items = slugs.map((s) => packages.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const [i, setI] = useState(0);
  const pkg = items[i];
  if (!pkg) return null;
  const p = photo(pkg.photos[0]!);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">{title}</p>
        <div className="flex gap-1">
          {(['‹', '›'] as const).map((ch, d) => (
            <button
              key={ch}
              type="button"
              aria-label={d === 0 ? 'Previous pick' : 'Next pick'}
              className="grid h-7 w-7 place-items-center rounded-pill border border-line text-ink-900 hover:border-primary hover:text-primary"
              onClick={() => setI((v) => (v + (d === 0 ? -1 : 1) + items.length) % items.length)}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
      <Link href="/tour-packages" onClick={onNavigate} className="group/promo block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card">
          <Image key={pkg.slug} src={p.src} alt={p.alt} fill sizes="300px" className="animate-fade object-cover" />
          <span className="absolute left-3 top-3 rounded-pill bg-surface/95 px-2 py-0.5 text-micro font-semibold text-ink-900">
            {pkg.nights}N/{pkg.nights + 1}D
          </span>
        </div>
        <p className="mt-3 font-semibold text-ink-900 group-hover/promo:text-primary">{pkg.title}</p>
        <p className="text-small text-ink-500">
          from <span className="font-bold text-accent-text">{formatINR(pkg.price)}</span> per person
        </p>
      </Link>
    </div>
  );
}
