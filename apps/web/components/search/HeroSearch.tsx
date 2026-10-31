'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePackageCount } from '@/hooks/usePackageCount';
import { formatINR } from '@/lib/content';
import {
  dateKey,
  describeTravellers,
  describeWhen,
  INITIAL_SEARCH,
  monthKey,
  packagesLabel,
  whenToMonths,
  type DestinationSuggestion,
  type SearchField,
  type SearchState,
} from '@/lib/search-types';
import { DestinationCombobox } from './DestinationCombobox';
import { MobileSearchSheet } from './MobileSearchSheet';
import { PopularChips } from './PopularChips';
import { FIELD_LABEL, FIELD_VALUE, fieldClass } from './SearchPanel';
import { TravellersContent, TravellersPopover } from './TravellersPopover';
import { TypewriterPlaceholder } from './TypewriterPlaceholder';
import { WhenContent, WhenPopover } from './WhenPopover';

const STORAGE_KEY = 'asia-travels:last-search';
const DESKTOP_QUERY = '(min-width: 1024px)';
const SHEET_TITLE: Record<SearchField, string> = { where: 'Where to', when: 'When', travellers: 'Travellers' };

/** Reads the saved search, dropping anything malformed or now in the past. */
function loadLastSearch(): SearchState | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as SearchState | null;
    if (!saved || typeof saved.destinationText !== 'string' || !saved.when || !saved.travellers) return null;
    const now = new Date();
    if (saved.when.mode === 'months') {
      saved.when.months = saved.when.months.filter((m) => m >= monthKey(now));
    } else if (saved.when.start && saved.when.start < dateKey(now)) {
      saved.when = { mode: 'dates', start: null, end: null };
    }
    return saved;
  } catch {
    return null;
  }
}

function saveLastSearch(search: SearchState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(search));
  } catch {
    // Storage can be blocked or full; the search still works without it.
  }
}

function resultsUrl({ destinationId, destinationText, when, travellers }: SearchState) {
  const destination = destinationId ?? destinationText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const months = whenToMonths(when);
  // Built by hand so the commas in the lists stay readable in the address bar.
  const parts = [
    destination && `destination=${destination}`,
    months.length > 0 && `months=${months.join(',')}`,
    when.mode === 'dates' && when.start && `from=${when.start}`,
    when.mode === 'dates' && when.end && `to=${when.end}`,
    `adults=${travellers.adults}`,
    travellers.children > 0 && `children=${travellers.children}`,
    travellers.children > 0 && `childAges=${travellers.childAges.join(',')}`,
    travellers.infants > 0 && `infants=${travellers.infants}`,
  ].filter(Boolean);
  return `/packages?${parts.join('&')}`;
}

export function HeroSearch({ onWordChange }: { onWordChange?: (word: string) => void }) {
  const router = useRouter();
  const [search, setSearch] = useState<SearchState>(INITIAL_SEARCH);
  const [openField, setOpenField] = useState<SearchField | null>(null);
  const [focusedField, setFocusedField] = useState<SearchField | null>(null);
  const [sheet, setSheet] = useState<SearchField | null>(null);
  const triggers = useRef<Partial<Record<SearchField, HTMLElement | null>>>({});
  const mobileTriggers = useRef<Partial<Record<SearchField, HTMLElement | null>>>({});
  const { data, loading } = usePackageCount(search);
  const focusOnMount = useCallback((el: HTMLInputElement | null) => el?.focus(), []);

  // After mount, because the server can't read localStorage.
  useEffect(() => {
    const saved = loadLastSearch();
    if (saved) setSearch(saved);
  }, []);

  const closeSheet = useCallback(() => {
    setSheet((current) => {
      if (current) mobileTriggers.current[current]?.focus();
      return null;
    });
  }, []);

  const closePopover = useCallback((returnFocus: boolean) => {
    setOpenField((current) => {
      if (current && returnFocus) triggers.current[current]?.focus();
      return null;
    });
  }, []);

  useEffect(() => {
    if (!openField) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element).closest('[data-search-field]')) closePopover(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [openField, closePopover]);

  // Crossing to desktop width would leave a hidden sheet holding the scroll lock.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setSheet(null);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const openWhen = () => {
    if (window.matchMedia(DESKTOP_QUERY).matches) {
      setOpenField('when');
      triggers.current.when?.focus();
    } else {
      setSheet('when');
    }
  };

  const chooseDestination = (id: string, name: string) => {
    setSearch((s) => ({ ...s, destinationId: id, destinationText: name }));
    openWhen();
  };

  const submit = () => {
    setOpenField(null);
    setSheet(null);
    saveLastSearch(search);
    router.push(resultsUrl(search));
  };

  const count = data?.count;
  const noPackages = !loading && count === 0;
  const hasResult = !loading && !!count;
  const primaryLabel = loading ? 'Finding packages…' : noPackages ? 'No packages yet' : hasResult ? `View ${packagesLabel(count!)}` : 'View packages';
  const priceLabel = hasResult ? `from ${formatINR(data!.minPrice)}` : '';
  const sheetFooter = loading ? 'Finding packages…' : noPackages ? 'No packages yet' : hasResult ? `Show ${packagesLabel(count!)}` : 'Show packages';
  const announcement = hasResult ? `${packagesLabel(count!)} ${priceLabel}` : noPackages ? 'No packages yet' : '';
  const highlighted = openField ?? focusedField;

  const fieldEvents = (field: SearchField) => ({
    onFocus: () => setFocusedField(field),
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      setFocusedField((f) => (f === field ? null : f));
      // Tabbing out closes the popover. A click elsewhere has no related target and is handled by the outside-click listener.
      if (e.relatedTarget) setOpenField((f) => (f === field ? null : f));
    },
  });

  // A divider disappears when the field on either side of it is active.
  const divider = (field: SearchField, previous: SearchField) => `border-l ${highlighted === field || highlighted === previous ? 'border-transparent' : 'border-[#E3DDD5]'}`;

  const popupField = (field: 'when' | 'travellers', Icon: LucideIcon, label: string, value: string) => {
    const isOpen = openField === field;
    return (
      <label className={fieldClass(highlighted === field)}>
        <Icon aria-hidden size={20} strokeWidth={2} className="shrink-0 text-[#C4401A]" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className={FIELD_LABEL}>{label}</span>
          {/* The ::after stretches the button over the whole field, which is also what makes it a 44px+ target. */}
          <button
            ref={(el) => {
              triggers.current[field] = el;
            }}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpenField(isOpen ? null : field)}
            className={`truncate text-left after:absolute after:inset-0 focus-visible:outline-none ${FIELD_VALUE}`}
          >
            {value}
          </button>
        </span>
      </label>
    );
  };

  const mobileField = (field: SearchField, Icon: LucideIcon, label: string, value: React.ReactNode) => (
    <button
      ref={(el) => {
        mobileTriggers.current[field] = el;
      }}
      type="button"
      onClick={() => setSheet(field)}
      className="flex w-full min-w-0 items-center gap-2.5 rounded-xl bg-[#F6F3EF] px-3.5 py-[0.6875rem] text-left"
    >
      <Icon aria-hidden size={20} strokeWidth={2} className="shrink-0 text-[#C4401A]" />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[0.6875rem] font-bold uppercase leading-tight tracking-[0.06em] text-[#5E564E]">{label}</span>
        <span className="truncate text-[1rem] font-semibold leading-snug text-[#14110F]">{value}</span>
      </span>
    </button>
  );

  return (
    <div className="mt-6 text-left [font-family:var(--font-manrope)] md:mt-8">
      <form
        role="search"
        aria-label="Search packages"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="[--focus-ring:#14110F]"
      >
        {/* Desktop bar */}
        <div className="relative mx-auto hidden max-w-[58.75rem] grid-cols-[1.5fr_1fr_1fr_auto] items-stretch rounded-[1.125rem] bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.30)] lg:grid">
          <div data-search-field className="relative min-w-0" {...fieldEvents('where')}>
            <DestinationCombobox
              ref={(el) => {
                triggers.current.where = el;
              }}
              value={search.destinationText}
              open={openField === 'where'}
              active={highlighted === 'where'}
              onTextChange={(text) => setSearch((s) => ({ ...s, destinationId: null, destinationText: text }))}
              onSelect={(item: DestinationSuggestion) => chooseDestination(item.id, item.name)}
              onOpen={() => setOpenField('where')}
              onClose={() => setOpenField(null)}
              onWordChange={onWordChange}
            />
          </div>
          {/* In exact-dates mode the wide calendar anchors to the bar rather than this column. */}
          <div data-search-field className={`min-w-0 ${divider('when', 'where')} ${search.when.mode === 'dates' && openField === 'when' ? '' : 'relative'}`} {...fieldEvents('when')}>
            {popupField('when', Calendar, 'When', describeWhen(search.when))}
            {openField === 'when' && <WhenPopover value={search.when} onChange={(when) => setSearch((s) => ({ ...s, when }))} onDone={() => closePopover(true)} />}
          </div>
          <div data-search-field className={`relative min-w-0 ${divider('travellers', 'when')}`} {...fieldEvents('travellers')}>
            {popupField('travellers', Users, 'Travellers', describeTravellers(search.travellers))}
            {openField === 'travellers' && <TravellersPopover value={search.travellers} onChange={(travellers) => setSearch((s) => ({ ...s, travellers }))} onDone={() => closePopover(true)} />}
          </div>
          <button type="submit" className="ml-2 flex min-h-[3.75rem] min-w-[12.75rem] flex-col items-center justify-center whitespace-nowrap rounded-xl bg-[#C4401A] px-7 text-white transition-[background-color,transform] duration-150 hover:bg-[#A8361A] active:scale-[0.98]">
            <span className="text-[1rem] font-bold leading-tight">{primaryLabel}</span>
            {priceLabel && <span className="mt-0.5 text-[0.75rem] font-semibold leading-tight text-[#FFF1EB]">{priceLabel}</span>}
          </button>
        </div>

        {/* Mobile card */}
        <div className="mx-1 grid gap-2 rounded-[1.125rem] bg-white p-2 shadow-[0_24px_60px_rgba(0,0,0,0.30)] lg:hidden">
          {mobileField(
            'where',
            MapPin,
            'Where to',
            <>
              {search.destinationText}
              {!search.destinationText && <span className="sr-only">Search destinations</span>}
              <TypewriterPlaceholder active={!search.destinationText} paused={!!sheet} onWordChange={onWordChange} className="block text-[1rem]" />
            </>,
          )}
          <div className="grid grid-cols-2 gap-2">
            {mobileField('when', Calendar, 'When', describeWhen(search.when))}
            {mobileField('travellers', Users, 'Travellers', describeTravellers(search.travellers))}
          </div>
          <button type="submit" className="flex h-[3.375rem] items-center justify-center gap-1 whitespace-nowrap rounded-xl bg-[#C4401A] px-3 text-[1rem] font-bold text-white transition-[background-color,transform] duration-150 hover:bg-[#A8361A] active:scale-[0.98]">
            {primaryLabel}
            {priceLabel && <span className="font-semibold text-[#FFF1EB] max-[359px]:hidden">· {priceLabel}</span>}
          </button>
        </div>
      </form>

      {noPackages && (
        <p className="mt-2 text-center [--focus-ring:#FFFFFF]">
          <Link href="/#plan-my-trip" className="inline-flex min-h-11 items-center text-[0.9375rem] font-bold text-white underline underline-offset-4 [text-shadow:0_1px_8px_rgba(8,12,10,0.7)]">
            Talk to an expert
          </Link>
        </p>
      )}

      <PopularChips onPick={chooseDestination} />

      <p aria-live="polite" className="sr-only">{announcement}</p>

      {sheet && (
        <MobileSearchSheet title={SHEET_TITLE[sheet]} footerLabel={sheetFooter} focusOnOpen={sheet !== 'where'} onClose={closeSheet} onSubmit={submit}>
          {sheet === 'where' && (
            <DestinationCombobox
              inline
              open
              ref={focusOnMount}
              value={search.destinationText}
              onTextChange={(text) => setSearch((s) => ({ ...s, destinationId: null, destinationText: text }))}
              onSelect={(item) => {
                setSearch((s) => ({ ...s, destinationId: item.id, destinationText: item.name }));
                setSheet('when');
              }}
              onOpen={() => {}}
              onClose={closeSheet}
            />
          )}
          {sheet === 'when' && <WhenContent stacked value={search.when} onChange={(when) => setSearch((s) => ({ ...s, when }))} />}
          {sheet === 'travellers' && <TravellersContent value={search.travellers} onChange={(travellers) => setSearch((s) => ({ ...s, travellers }))} />}
        </MobileSearchSheet>
      )}
    </div>
  );
}
