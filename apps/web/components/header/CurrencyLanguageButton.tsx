'use client';

import { useEffect, useId, useRef, useState } from 'react';

const CURRENCIES: { code: string; prefix: string }[] = [
  { code: 'INR', prefix: '₹ ' },
  { code: 'USD', prefix: '$ ' },
  { code: 'AED', prefix: '' },
  { code: 'SGD', prefix: 'S$ ' },
  { code: 'EUR', prefix: '€ ' },
  { code: 'GBP', prefix: '£ ' },
];
const LANGUAGES = [
  { code: 'en', label: 'English', available: true },
  { code: 'hi', label: 'हिन्दी (soon)', available: false },
  { code: 'ar', label: 'العربية (soon)', available: false },
];

const SELECT = 'mt-1 block h-11 w-full cursor-pointer rounded-lg border border-[#E3DDD5] bg-white px-2 text-[0.875rem] font-semibold text-[#14110F] focus-visible:outline-[#14110F]';

/** One utility-bar button that opens the currency and language selectors. */
export function CurrencyLanguageButton({ className }: { className: string }) {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState('INR');
  const [language, setLanguage] = useState('en');
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const prefix = CURRENCIES.find((c) => c.code === currency)?.prefix ?? '';
  const languageLabel = LANGUAGES.find((l) => l.code === language)?.label ?? '';

  return (
    <div ref={rootRef} className="relative h-full">
      <button ref={buttonRef} type="button" aria-expanded={open} aria-controls={open ? panelId : undefined} onClick={() => setOpen((o) => !o)} className={className}>
        {prefix}{currency} · {languageLabel}
      </button>
      {open && (
        <div id={panelId} className="animate-fade absolute right-0 top-full z-megamenu mt-2 w-56 space-y-3 rounded-xl bg-white p-3 text-[0.8125rem] font-semibold text-[#5E564E] shadow-[0_18px_40px_rgba(0,0,0,0.30)]">
          <label className="block">
            Currency
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={SELECT}>
              {CURRENCIES.map((c) => <option key={c.code}>{c.code}</option>)}
            </select>
          </label>
          <label className="block">
            Language
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={SELECT}>
              {LANGUAGES.map((l) => <option key={l.code} value={l.code} disabled={!l.available}>{l.label}</option>)}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
