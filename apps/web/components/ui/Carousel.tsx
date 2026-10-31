'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Horizontal scroll-snap rail with arrow buttons; native scrolling/swipe stays intact. */
export function Carousel({ label, children }: { label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={ref} onScroll={update} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 lg:mx-0 lg:scroll-px-0 lg:px-0 lg:gap-6">
        {children}
      </div>
      {(['prev', 'next'] as const).map((d) => {
        const disabled = d === 'prev' ? edges.start : edges.end;
        return (
          <button
            key={d}
            type="button"
            aria-label={d === 'prev' ? 'Scroll left' : 'Scroll right'}
            disabled={disabled}
            onClick={() => scroll(d === 'prev' ? -1 : 1)}
            className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-pill bg-surface text-ink-900 shadow-panel transition-opacity hover:text-primary disabled:pointer-events-none disabled:opacity-0 lg:grid ${
              d === 'prev' ? '-left-6' : '-right-6'
            }`}
          >
            {d === 'prev' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        );
      })}
    </div>
  );
}
