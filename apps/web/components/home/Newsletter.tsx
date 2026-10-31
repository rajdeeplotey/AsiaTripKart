'use client';

import { Mail } from 'lucide-react';
import { useState } from 'react';

/* 14 · Newsletter + app download */
export function Newsletter() {
  const [sent, setSent] = useState(false);
  return (
    <section className="section container-av" aria-label="Newsletter and app">
      <div className="grid items-center gap-10 rounded-card bg-primary px-6 py-10 text-white sm:px-12 lg:grid-cols-2">
        <div>
          <h2 className="text-h2 text-white">Get travel deals before anyone else</h2>
          <p className="mt-2 text-white/90">One email a fortnight: flash sales, new departures and guides. Unsubscribe anytime.</p>
          {sent ? (
            <p role="status" className="mt-6 rounded-md bg-white/15 px-4 py-3 font-semibold">Check your inbox to confirm your subscription.</p>
          ) : (
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label className="flex h-12 flex-1 items-center gap-2 rounded-pill bg-surface px-5 text-ink-900">
                <Mail aria-hidden className="h-5 w-5 text-ink-500" />
                <span className="sr-only">Email address</span>
                <input required type="email" placeholder="you@example.com" className="w-full bg-transparent focus:outline-none" />
              </label>
              <button type="submit" className="btn-cta h-12 px-8">Subscribe</button>
            </form>
          )}
        </div>
        <div className="lg:justify-self-end">
          <p className="font-display text-h3 text-white">The AsiaVoyage app</p>
          <p className="mt-1 text-white/90">Your itinerary offline, live trip updates and one-tap support.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {['App Store', 'Google Play'].map((s) => (
              <span key={s} className="inline-flex flex-col rounded-md border border-white/40 bg-ink-900 px-5 py-2 leading-tight">
                <span className="text-[0.625rem] uppercase tracking-wider text-white/80">Coming soon on</span>
                <span className="font-semibold text-white">{s}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
