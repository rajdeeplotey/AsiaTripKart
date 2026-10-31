'use client';

import { useEffect, useRef } from 'react';

// Styles shared by the bar's three fields.
export const FIELD_LABEL = 'text-[0.75rem] font-bold uppercase leading-tight tracking-[0.06em] text-[#5E564E]';
export const FIELD_VALUE = 'text-[1.0625rem] font-semibold leading-snug text-[#14110F]';
export const fieldClass = (active: boolean) =>
  `relative flex h-full cursor-pointer items-center gap-3 rounded-xl px-[1.125rem] py-2.5 transition-colors ${
    active ? 'bg-[#F6F3EF] shadow-[inset_0_0_0_2px_#14110F]' : 'hover:bg-[#F6F3EF]'
  }`;
export const DONE_BUTTON = 'relative h-10 rounded-[0.625rem] bg-[#14110F] px-5 text-[0.875rem] font-bold text-white before:absolute before:inset-x-0 before:-inset-y-0.5';

/** Floating panel below a field. It scrolls into view on opening and whenever it grows, in case it ends below the fold. */
export function SearchPanel({ id, className, children }: { id?: string; className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const panel = ref.current;
    if (!panel) return;
    const observer = new ResizeObserver(() => panel.scrollIntoView({ block: 'nearest' }));
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} id={id} className={`animate-fade absolute top-full z-50 mt-4 scroll-mb-4 rounded-2xl bg-white p-2 text-left text-[#14110F] shadow-[0_18px_40px_rgba(0,0,0,0.30)] ${className}`}>
      {children}
    </div>
  );
}
