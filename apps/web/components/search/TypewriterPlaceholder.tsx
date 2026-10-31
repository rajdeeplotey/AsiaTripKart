'use client';

import { useEffect, useRef, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { TYPEWRITER_WORDS } from '@/lib/search-config';

const TIMING = { typeMs: 110, deleteMs: 55, holdMs: 1600, gapMs: 350 };

/**
 * Animated `Search "Japan"` text for an empty WHERE TO field. Purely visual: the field supplies its own label for assistive tech.
 * `active` shows it and restarts the current word; `paused` freezes it in place. It also rests while off screen or inside
 * the breakpoint's hidden layout, because a display:none element never intersects.
 */
export function TypewriterPlaceholder({
  active,
  paused = false,
  onWordChange,
  className,
}: {
  active: boolean;
  paused?: boolean;
  onWordChange?: (word: string) => void;
  className: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // After mount, because the server cannot know the visitor's motion preference.
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const enabled = active && !reducedMotion;
  const resting = paused || !inView || tabHidden;
  const { text, wordIndex } = useTypewriter(TYPEWRITER_WORDS, { ...TIMING, enabled, paused: resting });
  const word = TYPEWRITER_WORDS[wordIndex];

  // Fires again on resuming, so the photo catches up with the word if the slideshow moved on in the meantime.
  useEffect(() => {
    if (enabled && !resting && word) onWordChange?.(word);
  }, [enabled, resting, word, onWordChange]);

  return (
    <span ref={ref} aria-hidden className={active ? `pointer-events-none overflow-hidden whitespace-nowrap font-medium leading-snug text-[#8A8178] ${className}` : 'hidden'}>
      Search &quot;{reducedMotion ? TYPEWRITER_WORDS[0] : text}
      {!reducedMotion && <span className="animate-caret ml-px inline-block h-[1em] w-px bg-[#C4401A] align-[-0.125em]" />}
      &quot;
    </span>
  );
}
