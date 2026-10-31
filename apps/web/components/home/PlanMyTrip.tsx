'use client';

import Image from 'next/image';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { photo } from '@/lib/images';

const STEPS = ['Destination', 'Dates & budget', 'Contact'] as const;
const field = 'mt-1 h-12 w-full rounded-md border border-line-strong bg-surface px-4 text-ink-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30';

/* 9 · Plan my trip: 3-step lead form. Submits to POST /v1/leads once the API ships (backlog E6-10). */
export function PlanMyTrip() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const p = photo('plan');

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.reportValidity()) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  return (
    <section id="plan-my-trip" className="section container-av scroll-mt-24" aria-label="Plan my trip">
      <div className="grid overflow-hidden rounded-card bg-surface shadow-card lg:grid-cols-2">
        <div className="relative min-h-[16.25rem]">
          <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="text-micro font-semibold uppercase tracking-wider text-gold">Tailor-made</p>
            <p className="mt-2 max-w-sm font-display text-h2 text-white">Tell us your dream trip. We will draft it in 24 hours.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          {done ? (
            <div className="animate-fade flex h-full flex-col items-center justify-center py-10 text-center">
              <CircleCheck aria-hidden className="h-14 w-14 text-success" />
              <h2 className="mt-4 text-h3">Request received</h2>
              <p className="mt-2 max-w-sm">A destination expert will call you within 2 working hours with a first draft of your itinerary.</p>
              <button type="button" className="btn-outline mt-6" onClick={() => { setDone(false); setStep(0); }}>Plan another trip</button>
            </div>
          ) : (
            <>
              <p className="eyebrow">Plan my trip</p>
              <h2 className="mt-1 text-h3">Free itinerary from a local expert</h2>
              <ol className="mt-6 flex gap-2" aria-label="Progress">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex-1" aria-current={i === step ? 'step' : undefined}>
                    <div className={`h-1.5 rounded-pill ${i <= step ? 'bg-primary' : 'bg-line'}`} />
                    <p className={`mt-2 text-micro font-semibold ${i === step ? 'text-primary' : 'text-ink-500'}`}>{i + 1}. {s}</p>
                  </li>
                ))}
              </ol>

              <form onSubmit={next} className="mt-6 space-y-4" noValidate={false}>
                {step === 0 && (
                  <>
                    <label className="block text-small font-semibold text-ink-900">
                      Where would you like to go?
                      <input required name="destination" placeholder="e.g. Japan, Bali, or 'not sure yet'" className={field} />
                    </label>
                    <fieldset>
                      <legend className="text-small font-semibold text-ink-900">Trip style</legend>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {['Honeymoon', 'Family', 'Friends', 'Solo', 'Corporate / MICE'].map((t) => (
                          <label key={t} className="cursor-pointer">
                            <input type="radio" name="style" value={t} className="peer sr-only" defaultChecked={t === 'Honeymoon'} />
                            <span className="inline-block rounded-pill border border-line-strong px-4 py-2 text-small font-medium text-ink-600 peer-checked:border-primary peer-checked:bg-primary-50 peer-checked:text-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary">{t}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </>
                )}
                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-small font-semibold text-ink-900">
                      Travel month
                      <input required type="month" name="month" className={field} />
                    </label>
                    <label className="block text-small font-semibold text-ink-900">
                      Nights
                      <input required type="number" min={2} max={30} defaultValue={6} name="nights" className={field} />
                    </label>
                    <label className="block text-small font-semibold text-ink-900">
                      Travellers
                      <input required type="number" min={1} max={200} defaultValue={2} name="pax" className={field} />
                    </label>
                    <label className="block text-small font-semibold text-ink-900">
                      Budget per person
                      <select name="budget" className={field} defaultValue="50-100">
                        <option value="0-50">Under ₹50,000</option>
                        <option value="50-100">₹50,000 – ₹1 lakh</option>
                        <option value="100-200">₹1 – 2 lakh</option>
                        <option value="200+">₹2 lakh+</option>
                      </select>
                    </label>
                  </div>
                )}
                {step === 2 && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-small font-semibold text-ink-900">
                        Full name
                        <input required name="name" autoComplete="name" className={field} />
                      </label>
                      <label className="block text-small font-semibold text-ink-900">
                        Mobile (WhatsApp)
                        <input required type="tel" name="phone" autoComplete="tel" pattern="[+0-9 ]{10,15}" placeholder="+91" className={field} />
                      </label>
                    </div>
                    <label className="block text-small font-semibold text-ink-900">
                      Email
                      <input required type="email" name="email" autoComplete="email" className={field} />
                    </label>
                    <label className="flex items-start gap-3 text-small">
                      <input required type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-[var(--brand-primary)]" />
                      <span>I agree to be contacted about my trip on phone, email and WhatsApp, and to the privacy policy.</span>
                    </label>
                  </>
                )}
                <div className="flex items-center justify-between pt-2">
                  {step > 0 ? (
                    <button type="button" className="text-small font-semibold text-ink-600 hover:text-primary" onClick={() => setStep(step - 1)}>← Back</button>
                  ) : <span />}
                  <button type="submit" className="btn-cta px-8">{step === STEPS.length - 1 ? 'Get my free itinerary' : 'Continue'}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
