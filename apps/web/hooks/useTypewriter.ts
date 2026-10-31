'use client';

import { useEffect, useState } from 'react';

type Step = { wordIndex: number; length: number; phase: 'type' | 'hold' | 'delete' | 'gap' };

function advance(step: Step, words: readonly string[]): Step {
  const { wordIndex, length, phase } = step;
  const wordLength = words[wordIndex]?.length ?? 0;
  if (phase === 'type') return length + 1 >= wordLength ? { ...step, length: wordLength, phase: 'hold' } : { ...step, length: length + 1 };
  if (phase === 'gap') return { wordIndex: (wordIndex + 1) % words.length, length: 1, phase: 'type' };
  return length <= 1 ? { ...step, length: 0, phase: 'gap' } : { ...step, length: length - 1, phase: 'delete' };
}

/**
 * Types and erases each word in turn, looping forever. Turning `enabled` off starts the current word over
 * when it comes back; `paused` freezes it mid-letter instead.
 */
export function useTypewriter(
  words: readonly string[],
  { typeMs, deleteMs, holdMs, gapMs, enabled, paused = false }: { typeMs: number; deleteMs: number; holdMs: number; gapMs: number; enabled: boolean; paused?: boolean },
) {
  const [step, setStep] = useState<Step>({ wordIndex: 0, length: 0, phase: 'type' });
  const { wordIndex, length, phase } = step;

  useEffect(() => {
    if (!enabled) setStep((s) => ({ ...s, length: 0, phase: 'type' }));
  }, [enabled]);

  // Each step schedules the next, so there is only ever one timer to clear.
  useEffect(() => {
    if (!enabled || paused || words.length === 0) return;
    const delay = { type: typeMs, hold: holdMs, delete: deleteMs, gap: gapMs }[phase];
    const t = setTimeout(() => setStep((s) => advance(s, words)), delay);
    return () => clearTimeout(t);
  }, [words, typeMs, deleteMs, holdMs, gapMs, enabled, paused, wordIndex, length, phase]);

  return { text: words[wordIndex]?.slice(0, length) ?? '', wordIndex };
}
