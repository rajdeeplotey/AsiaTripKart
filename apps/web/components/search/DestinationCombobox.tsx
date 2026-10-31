'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { forwardRef, useEffect, useId, useState } from 'react';
import { packagesLabel, type DestinationSuggestion, type DestinationType } from '@/lib/search-types';
import { FIELD_LABEL, FIELD_VALUE, fieldClass, SearchPanel } from './SearchPanel';
import { TypewriterPlaceholder } from './TypewriterPlaceholder';

const DEBOUNCE_MS = 150;
const TYPE_LABEL: Record<DestinationType, string> = { country: 'Country', region: 'Region', 'trip-style': 'Trip style' };

function Highlighted({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const at = q ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <strong className="font-bold text-[#A8361A]">{text.slice(at, at + q.length)}</strong>
      {text.slice(at + q.length)}
    </>
  );
}

function SuggestionRow({ item, query, id, active, onHover, onPick }: { item: DestinationSuggestion; query: string; id: string; active: boolean; onHover: () => void; onPick: () => void }) {
  const Icon = item.type === 'trip-style' ? Heart : MapPin;
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      // Real movement only: when the page scrolls, a row sliding under a still pointer must not steal the keyboard highlight.
      onMouseMove={(e) => {
        if (e.movementX || e.movementY) onHover();
      }}
      onMouseDown={(e) => e.preventDefault()} // keeps focus in the input until the click lands
      onClick={onPick}
      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-[0.625rem] px-3 py-2.5 ${active ? 'bg-[#FBEDE7]' : ''}`}
    >
      {item.imageUrl ? (
        <Image src={item.imageUrl} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-lg object-cover" />
      ) : (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F6F3EF] text-[#5E564E]">
          <Icon aria-hidden size={18} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[0.9375rem] font-bold leading-snug text-[#14110F]">
          <Highlighted text={item.name} query={query} />
        </span>
        <span className="block text-[0.8125rem] leading-snug text-[#5E564E]">
          {TYPE_LABEL[item.type]} · {packagesLabel(item.packageCount)}
        </span>
      </span>
    </li>
  );
}

/** WHERE TO field and typeahead. `inline` is the mobile sheet layout, with the list in the page flow rather than floating. */
export const DestinationCombobox = forwardRef<
  HTMLInputElement,
  {
    value: string;
    open: boolean;
    active?: boolean;
    inline?: boolean;
    onTextChange: (text: string) => void;
    onSelect: (item: DestinationSuggestion) => void;
    onOpen: () => void;
    onClose: () => void;
    onWordChange?: (word: string) => void;
  }
>(function DestinationCombobox({ value, open, active = false, inline = false, onTextChange, onSelect, onOpen, onClose, onWordChange }, ref) {
  const [items, setItems] = useState<DestinationSuggestion[] | null>(null);
  const [highlight, setHighlight] = useState(-1);
  const [focused, setFocused] = useState(false);
  const animating = !value && !focused;
  const baseId = useId();
  const listId = `${baseId}-list`;
  const headingId = `${baseId}-heading`;
  const query = value.trim();

  // Reset on a new query or reopening, not on new results, so a late response can't wipe the visitor's arrow-key choice.
  useEffect(() => setHighlight(-1), [query, open]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = setTimeout(
      async () => {
        try {
          const res = await fetch(`/api/destinations/suggest?q=${encodeURIComponent(query)}`, { signal: controller.signal });
          if (!res.ok) throw new Error(`Suggest request failed: ${res.status}`);
          const body = (await res.json()) as { items: DestinationSuggestion[] };
          setItems(body.items);
        } catch {
          if (!controller.signal.aborted) setItems([]);
        }
      },
      query ? DEBOUNCE_MS : 0,
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  const hasList = open && !!items && items.length > 0;
  const noResults = open && !!items && items.length === 0 && !!query;
  const optionId = (i: number) => `${baseId}-option-${i}`;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (open && !inline) {
        e.stopPropagation();
        onClose();
      }
      return;
    }
    if (!hasList) {
      if (e.key === 'ArrowDown') onOpen();
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const last = items.length - 1;
      setHighlight((h) => (e.key === 'ArrowDown' ? (h >= last ? 0 : h + 1) : h <= 0 ? last : h - 1));
    } else if ((e.key === 'Enter' || (e.key === 'Tab' && !e.shiftKey)) && highlight >= 0) {
      e.preventDefault();
      onSelect(items[highlight]!);
    }
  };

  const panelBody = (
    <>
      {hasList && !query && <p id={headingId} className="px-3 pb-1 pt-2 text-[0.75rem] font-bold uppercase tracking-[0.06em] text-[#5E564E]">Popular destinations</p>}
      {hasList && (
        <ul id={listId} role="listbox" aria-label={query ? 'Destination suggestions' : undefined} aria-labelledby={query ? undefined : headingId}>
          {items.map((item, i) => (
            <SuggestionRow key={item.id} item={item} query={query} id={optionId(i)} active={i === highlight} onHover={() => setHighlight(i)} onPick={() => onSelect(item)} />
          ))}
        </ul>
      )}
      {noResults && (
        <div className="px-3 py-2 text-[0.9375rem] text-[#14110F]">
          <p>No matches for &ldquo;{query}&rdquo;. Try a country or region.</p>
          <Link href="/#plan-my-trip" onClick={onClose} className="mt-1 inline-flex min-h-11 items-center font-bold text-[#A8361A] underline">Talk to an expert</Link>
        </div>
      )}
    </>
  );

  // The animated text overlays the input rather than driving its placeholder, which would flicker and spam screen readers.
  const input = (className: string, placeholderSize: string) => (
    <span className="relative block">
      <input
        ref={ref}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-label="Where to"
        aria-expanded={hasList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={hasList && highlight >= 0 ? optionId(highlight) : undefined}
        value={value}
        placeholder="Search destinations"
        onChange={(e) => {
          onTextChange(e.target.value);
          if (!open) onOpen();
        }}
        onFocus={() => {
          setFocused(true);
          onOpen();
        }}
        onBlur={() => setFocused(false)}
        onClick={onOpen}
        onKeyDown={onKeyDown}
        className={`block w-full min-w-0 bg-transparent placeholder:font-medium focus-visible:outline-none ${animating ? 'placeholder:text-transparent' : 'placeholder:text-[#8A8178]'} ${className}`}
      />
      <TypewriterPlaceholder active={animating} onWordChange={onWordChange} className={`absolute inset-0 block ${placeholderSize}`} />
    </span>
  );

  if (inline) {
    return (
      <div>
        <label className="flex min-h-14 cursor-text items-center gap-3 rounded-xl bg-[#F6F3EF] px-3.5 py-2.5 focus-within:shadow-[inset_0_0_0_2px_#14110F]">
          <MapPin aria-hidden size={20} strokeWidth={2} className="shrink-0 text-[#C4401A]" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={FIELD_LABEL}>Where to</span>
            {input('text-[1rem] font-semibold text-[#14110F]', 'text-[1rem]')}
          </span>
        </label>
        <div className="mt-2">{panelBody}</div>
      </div>
    );
  }

  return (
    <>
      <label className={fieldClass(active)}>
        <MapPin aria-hidden size={20} strokeWidth={2} className="shrink-0 text-[#C4401A]" />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className={FIELD_LABEL}>Where to</span>
          {input(FIELD_VALUE, 'text-[1.0625rem]')}
        </span>
      </label>
      {(hasList || noResults) && <SearchPanel className="left-0 w-[26.25rem]">{panelBody}</SearchPanel>}
    </>
  );
});
