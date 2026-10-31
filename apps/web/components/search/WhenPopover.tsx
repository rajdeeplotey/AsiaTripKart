'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ANY_MONTH, dateKey, monthKey, monthLabel, type WhenState } from '@/lib/search-types';
import { DONE_BUTTON, SearchPanel } from './SearchPanel';

const MAX_MONTHS = 3;
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** The months and exact-dates content, shared by the desktop popover and the mobile sheet. */
export function WhenContent({ value, onChange, onDone, stacked = false }: { value: WhenState; onChange: (next: WhenState) => void; onDone?: () => void; stacked?: boolean }) {
  const tab = (mode: WhenState['mode'], label: string) => (
    <button
      type="button"
      aria-pressed={value.mode === mode}
      onClick={() => {
        if (value.mode !== mode) onChange(mode === 'months' ? ANY_MONTH : { mode: 'dates', start: null, end: null });
      }}
      className={`h-11 flex-1 rounded-[0.625rem] text-[0.875rem] font-bold transition-colors ${value.mode === mode ? 'bg-white text-[#14110F] shadow-sm' : 'text-[#5E564E] hover:text-[#14110F]'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-2">
      <div className="flex gap-1 rounded-xl bg-[#F6F3EF] p-1">
        {tab('months', 'Any month')}
        {tab('dates', 'Exact dates')}
      </div>
      <div className="mt-3">
        {value.mode === 'months' ? (
          <MonthGrid selected={value.months} onChange={(months) => onChange({ mode: 'months', months })} />
        ) : (
          <RangeCalendar start={value.start} end={value.end} stacked={stacked} onChange={(start, end) => onChange({ mode: 'dates', start, end })} />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <button type="button" onClick={() => onChange(value.mode === 'months' ? ANY_MONTH : { mode: 'dates', start: null, end: null })} className="min-h-11 rounded-lg px-2 text-[0.875rem] font-bold text-[#14110F] underline">
          Clear
        </button>
        {onDone && <button type="button" onClick={onDone} className={DONE_BUTTON}>Done</button>}
      </div>
    </div>
  );
}

function MonthGrid({ selected, onChange }: { selected: string[]; onChange: (months: string[]) => void }) {
  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 12 }, (_, i) => monthKey(new Date(now.getFullYear(), now.getMonth() + i, 1)));
  }, []);
  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((m) => {
        const isOn = selected.includes(m);
        const atLimit = !isOn && selected.length >= MAX_MONTHS;
        return (
          <button
            key={m}
            type="button"
            aria-pressed={isOn}
            disabled={atLimit}
            onClick={() => onChange(isOn ? selected.filter((s) => s !== m) : [...selected, m].sort())}
            className={`h-11 rounded-[0.625rem] border text-[0.875rem] transition-colors disabled:cursor-not-allowed disabled:bg-[#F6F3EF] disabled:text-[#5E564E] ${
              isOn ? 'border-[#C4401A] bg-[#FBEDE7] font-bold text-[#A8361A]' : 'border-[#E3DDD5] font-semibold text-[#14110F] enabled:hover:bg-[#F6F3EF]'
            }`}
          >
            {monthLabel(m)} {m.slice(0, 4)}
          </button>
        );
      })}
    </div>
  );
}

function RangeCalendar({ start, end, stacked, onChange }: { start: string | null; end: string | null; stacked: boolean; onChange: (start: string | null, end: string | null) => void }) {
  const today = useMemo(() => dateKey(new Date()), []);
  const [offset, setOffset] = useState(0);
  const firstOfThisMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);
  const shown = [0, 1].map((i) => new Date(firstOfThisMonth.getFullYear(), firstOfThisMonth.getMonth() + offset + i, 1));

  const pick = (day: string) => {
    if (!start || end) onChange(day, null);
    else if (day < start) onChange(day, null);
    else onChange(start, day);
  };

  return (
    <div>
      <div className="flex justify-between">
        <button type="button" aria-label="Earlier months" disabled={offset === 0} onClick={() => setOffset((o) => o - 1)} className="grid h-11 w-11 place-items-center rounded-full text-[#14110F] hover:bg-[#F6F3EF] disabled:cursor-not-allowed disabled:text-[#5E564E] disabled:hover:bg-transparent">
          <ChevronLeft aria-hidden size={20} />
        </button>
        <button type="button" aria-label="Later months" disabled={offset >= 10} onClick={() => setOffset((o) => o + 1)} className="grid h-11 w-11 place-items-center rounded-full text-[#14110F] hover:bg-[#F6F3EF] disabled:cursor-not-allowed disabled:text-[#5E564E] disabled:hover:bg-transparent">
          <ChevronRight aria-hidden size={20} />
        </button>
      </div>
      <div className={stacked ? 'space-y-4' : 'grid grid-cols-2 gap-6'}>
        {shown.map((first) => (
          <CalendarMonth key={monthKey(first)} first={first} today={today} start={start} end={end} onPick={pick} />
        ))}
      </div>
    </div>
  );
}

function CalendarMonth({ first, today, start, end, onPick }: { first: Date; today: string; start: string | null; end: string | null; onPick: (day: string) => void }) {
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  return (
    <div>
      <p className="mb-2 text-center text-[0.9375rem] font-bold text-[#14110F]">{first.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
      <div className="grid grid-cols-7 justify-items-center">
        {WEEKDAYS.map((d) => (
          <span key={d} aria-hidden className="pb-1 text-[0.75rem] font-bold text-[#5E564E]">{d}</span>
        ))}
        {Array.from({ length: first.getDay() }, (_, i) => <span key={`blank-${i}`} aria-hidden />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(first.getFullYear(), first.getMonth(), i + 1);
          const key = dateKey(date);
          const isEnd = key === start || key === end;
          const inRange = !!start && !!end && key > start && key < end;
          return (
            <button
              key={key}
              type="button"
              disabled={key < today}
              aria-pressed={isEnd}
              aria-label={date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              onClick={() => onPick(key)}
              className={`h-11 w-11 rounded-[0.625rem] text-[0.875rem] font-semibold disabled:cursor-not-allowed disabled:font-medium disabled:text-[#6F675F] ${
                isEnd ? 'bg-[#C4401A] text-white' : inRange ? 'bg-[#FBEDE7] text-[#A8361A]' : 'text-[#14110F] enabled:hover:bg-[#F6F3EF]'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function WhenPopover({ value, onChange, onDone }: { value: WhenState; onChange: (next: WhenState) => void; onDone: () => void }) {
  // The two-month calendar is too wide for the field's column, so it centres under the whole bar.
  const position = value.mode === 'dates' ? 'left-1/2 w-[42rem] max-w-[calc(100vw-2rem)] -translate-x-1/2' : 'left-0 w-[22.5rem]';
  return (
    <SearchPanel className={position}>
      <WhenContent value={value} onChange={onChange} onDone={onDone} />
    </SearchPanel>
  );
}
