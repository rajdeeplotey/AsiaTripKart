'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { heroSlides, heroTrust } from '@/lib/content';
import { photo } from '@/lib/images';
import { HeroSearch } from '@/components/search/HeroSearch';
import { HeroTrustBar } from './HeroTrustBar';

const ROTATE_MS = 6000;

export function Hero() {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Read after mount because the server cannot know the visitor's motion preference.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsPaused(true);
  }, []);

  // Re-armed on every slide change, so a slide picked by the visitor gets its full display time.
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [isPaused, slide]);

  // The search placeholder steers the photo while it types, unless the visitor paused the slideshow.
  const onWordChange = useCallback(
    (word: string) => {
      if (isPaused) return;
      const match = heroSlides.findIndex((s) => s.name.includes(word) || s.country === word);
      if (match >= 0) setSlide(match);
    },
    [isPaused],
  );

  return (
    // Fills the viewport above the mobile tab bar, with a 600px floor on short screens.
    // The top padding clears the fixed header; the copy centres in the space left between it and the dots and trust bar.
    // Only the photo layer clips, and z-[1] lifts the hero above later sections, so search popovers can float past its bottom edge.
    <section aria-label="Discover Asia" className="relative isolate z-[1] flex min-h-[max(37.5rem,calc(100svh-4rem-env(safe-area-inset-bottom)))] flex-col pt-[calc(var(--header-sticky-h)+1.5rem)] lg:min-h-[max(37.5rem,100svh)] lg:pt-[calc(var(--header-utility-h)+var(--header-h)+1.5rem)]">
      <div className="absolute inset-0 -z-20 overflow-hidden">
      {heroSlides.map((s, i) => {
        const p = photo(s.photo);
        return (
          <Image
            key={s.photo}
            src={p.src}
            alt={i === slide ? p.alt : ''}
            fill
            priority={i === 0}
            // Eager, so no slide can fade in before its photo has arrived.
            loading="eager"
            sizes="100vw"
            quality={80}
            style={{ objectPosition: s.focus }}
            className={`object-cover transition-opacity duration-[600ms] ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          />
        );
      })}
      </div>
      <div aria-hidden className="absolute inset-0 -z-10" style={{ background: 'var(--hero-gradient)' }} />

      <div className="flex flex-1 items-center pb-6">
        <div className="container-av text-center">
        <h1 className="mx-auto max-w-3xl text-display font-normal text-white [font-family:var(--font-marcellus)] [text-wrap:balance] [text-shadow:0_2px_16px_rgba(17,24,39,0.45)]">Discover <span className="text-[#FEB112]">Asia,</span> Crafted Around You</h1>
        <p className="mx-auto mt-3 max-w-xl text-body leading-relaxed text-white [text-shadow:0_1px_10px_rgba(17,24,39,0.6)] md:text-[1.125rem]">
          Handpicked holidays across 48 countries, planned by local experts and supported 24×7.
        </p>
        <HeroSearch onWordChange={onWordChange} />
        </div>
      </div>

      <div className="flex justify-center pb-3">
        {heroSlides.map((s, i) => (
          // The thin bar is the visible dot; the 24px button around it is the tap target.
          <button
            key={s.photo}
            type="button"
            aria-label={`Show ${s.name}, ${s.country}`}
            aria-current={i === slide}
            onClick={() => setSlide(i)}
            className="group grid h-6 min-w-6 place-items-center px-1"
          >
            <span className={`block h-1.5 rounded-pill bg-white transition-all ${i === slide ? 'w-8' : 'w-3 opacity-60 group-hover:opacity-100'}`} />
          </button>
        ))}
      </div>

      <HeroTrustBar
        slides={heroSlides}
        currentIndex={slide}
        isPaused={isPaused}
        onNext={() => setSlide((s) => (s + 1) % heroSlides.length)}
        onTogglePause={() => setIsPaused((p) => !p)}
        {...heroTrust}
      />
    </section>
  );
}
