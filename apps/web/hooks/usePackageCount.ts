'use client';

import { useEffect, useState } from 'react';
import { whenToMonths, type PackageCount, type SearchState } from '@/lib/search-types';

const DEBOUNCE_MS = 250;

/** Debounced, abortable live count. `data` is null while loading, and also if the request failed. */
export function usePackageCount({ destinationId, destinationText, when, travellers }: SearchState) {
  const [data, setData] = useState<PackageCount | null>(null);
  const [loading, setLoading] = useState(true);

  const destination = destinationId ?? destinationText.trim();
  const month = whenToMonths(when).join(',');
  const people = travellers.adults + travellers.children + travellers.infants;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ destination, month, travellers: String(people) });
        const res = await fetch(`/api/packages/count?${params}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Count request failed: ${res.status}`);
        setData((await res.json()) as PackageCount);
        setLoading(false);
      } catch {
        if (controller.signal.aborted) return;
        setData(null);
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [destination, month, people]);

  return { data, loading };
}
