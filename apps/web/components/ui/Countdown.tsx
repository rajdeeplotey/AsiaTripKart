'use client';

import { useEffect, useState } from 'react';

function remaining(to: number) {
  const ms = Math.max(0, to - Date.now());
  return {
    Days: Math.floor(ms / 86_400_000),
    Hrs: Math.floor(ms / 3_600_000) % 24,
    Min: Math.floor(ms / 60_000) % 60,
    Sec: Math.floor(ms / 1000) % 60,
  };
}

/** Renders placeholders on the server and starts ticking after hydration, so markup never mismatches. */
export function Countdown({ to, tone = 'light' }: { to: string; tone?: 'light' | 'dark' }) {
  const target = new Date(to).getTime();
  const [parts, setParts] = useState<ReturnType<typeof remaining> | null>(null);

  useEffect(() => {
    setParts(remaining(target));
    const t = setInterval(() => setParts(remaining(target)), 1000);
    return () => clearInterval(t);
  }, [target]);

  const box = tone === 'dark' ? 'bg-white/15 text-white' : 'bg-surface text-ink-900 shadow-card';
  return (
    <div className="mt-4 flex gap-2" role="timer" aria-label="Time left in this offer">
      {(['Days', 'Hrs', 'Min', 'Sec'] as const).map((k) => (
        <div key={k} className={`min-w-[3.5rem] rounded-md px-2 py-2 text-center ${box}`}>
          <div className="font-display text-h3 tabular-nums leading-none">{parts ? String(parts[k]).padStart(2, '0') : '--'}</div>
          <div className="mt-1 text-[0.6875rem] font-semibold uppercase tracking-wider opacity-90">{k}</div>
        </div>
      ))}
    </div>
  );
}
