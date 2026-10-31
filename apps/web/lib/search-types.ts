// Types and small helpers for the hero search and its API responses.

export type DestinationType = 'country' | 'region' | 'trip-style';

export type DestinationSuggestion = {
  id: string;
  name: string;
  type: DestinationType;
  packageCount: number;
  imageUrl?: string;
};

export type PackageCount = { count: number; minPrice: number };

export type WhenState =
  | { mode: 'months'; months: string[] } // 'YYYY-MM'; empty means any month
  | { mode: 'dates'; start: string | null; end: string | null }; // 'YYYY-MM-DD'

export type TravellersState = { adults: number; children: number; infants: number; childAges: number[] };

export type SearchState = {
  destinationId: string | null; // null while the visitor is typing free text
  destinationText: string;
  when: WhenState;
  travellers: TravellersState;
};

export type SearchField = 'where' | 'when' | 'travellers';

export const ANY_MONTH: WhenState = { mode: 'months', months: [] };
export const DEFAULT_TRAVELLERS: TravellersState = { adults: 2, children: 0, infants: 0, childAges: [] };
export const INITIAL_SEARCH: SearchState = { destinationId: null, destinationText: '', when: ANY_MONTH, travellers: DEFAULT_TRAVELLERS };

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
export const dateKey = (d: Date) => `${monthKey(d)}-${String(d.getDate()).padStart(2, '0')}`;
export const monthLabel = (key: string) => SHORT_MONTHS[Number(key.slice(5, 7)) - 1]!;

const shortDate = (key: string) => `${Number(key.slice(8, 10))} ${monthLabel(key)}`;

export function describeWhen(when: WhenState) {
  if (when.mode === 'months') {
    if (when.months.length === 0) return 'Any month';
    if (when.months.length > 2) return `${when.months.length} months`;
    return when.months.map(monthLabel).join(', ');
  }
  if (!when.start) return 'Any month';
  if (!when.end) return shortDate(when.start);
  return when.start.slice(0, 7) === when.end.slice(0, 7)
    ? `${Number(when.start.slice(8, 10))}–${shortDate(when.end)}`
    : `${shortDate(when.start)}–${shortDate(when.end)}`;
}

/** The calendar months a search covers, for the count API and results URL. */
export function whenToMonths(when: WhenState) {
  if (when.mode === 'months') return when.months;
  if (!when.start) return [];
  const months: string[] = [];
  const last = (when.end ?? when.start).slice(0, 7);
  const cursor = new Date(Number(when.start.slice(0, 4)), Number(when.start.slice(5, 7)) - 1, 1);
  while (monthKey(cursor) <= last) {
    months.push(monthKey(cursor));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function describeTravellers({ adults, children, infants }: TravellersState) {
  if (infants > 0 || (children > 0 && adults > 9) || children > 9) return `${adults + children + infants} travellers`;
  const adultText = plural(adults, 'adult', 'adults');
  return children > 0 ? `${adultText}, ${plural(children, 'child', 'children')}` : adultText;
}

export const packagesLabel = (n: number) => plural(n, 'package', 'packages');
