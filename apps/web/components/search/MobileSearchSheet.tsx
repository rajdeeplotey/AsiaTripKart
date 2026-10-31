'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select';

/** Full-screen sheet. Rendered in <body> so it sits above the header and tab bar, outside the hero's stacking context. */
export function MobileSearchSheet({
  title,
  footerLabel,
  focusOnOpen = true,
  onClose,
  onSubmit,
  children,
}: {
  title: string;
  footerLabel: string;
  focusOnOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (focusOnOpen) closeRef.current?.focus();
  }, [focusOnOpen, title]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="animate-sheet fixed inset-0 z-drawer flex flex-col bg-white text-[#14110F] [--focus-ring:#14110F] [font-family:var(--font-manrope)] lg:hidden"
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#E3DDD5] pl-4 pr-2">
        <h2 className="font-[inherit] text-[1.125rem] font-bold text-[#14110F]">{title}</h2>
        <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full">
          <X aria-hidden size={24} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">{children}</div>
      <div className="shrink-0 border-t border-[#E3DDD5] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <button type="button" onClick={onSubmit} className="h-[3.375rem] w-full rounded-xl bg-[#C4401A] text-[1rem] font-bold text-white transition-colors hover:bg-[#A8361A]">
          {footerLabel}
        </button>
      </div>
    </div>,
    document.body,
  );
}
