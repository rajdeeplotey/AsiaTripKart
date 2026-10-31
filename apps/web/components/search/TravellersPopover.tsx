'use client';

import { Minus, Plus } from 'lucide-react';
import type { TravellersState } from '@/lib/search-types';
import { DONE_BUTTON, SearchPanel } from './SearchPanel';

const DEFAULT_CHILD_AGE = 5;
const CHILD_AGES = Array.from({ length: 11 }, (_, i) => i + 2); // 2 to 12

// The circle stays 36px; the pseudo-element extends its tap area to 44px.
const STEP_BUTTON = 'relative grid h-9 w-9 place-items-center rounded-full border border-[#E3DDD5] text-[#14110F] transition-colors before:absolute before:-inset-1 before:rounded-full enabled:hover:bg-[#F6F3EF] disabled:cursor-not-allowed disabled:bg-[#F6F3EF] disabled:text-[#6F675F]';

function Stepper({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (next: number) => void }) {
  const noun = label.toLowerCase();
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-[0.9375rem] font-bold text-[#14110F]">{label}</p>
        <p className="text-[0.8125rem] text-[#5E564E]">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${noun}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={STEP_BUTTON}>
          <Minus aria-hidden size={16} />
        </button>
        <span aria-live="polite" aria-label={`${value} ${noun}`} className="w-5 text-center text-[0.9375rem] font-bold text-[#14110F]">{value}</span>
        <button type="button" aria-label={`More ${noun}`} disabled={value >= max} onClick={() => onChange(value + 1)} className={STEP_BUTTON}>
          <Plus aria-hidden size={16} />
        </button>
      </div>
    </div>
  );
}

/** Steppers and child ages, shared by the desktop popover and the mobile sheet. */
export function TravellersContent({ value, onChange, onDone }: { value: TravellersState; onChange: (next: TravellersState) => void; onDone?: () => void }) {
  const setChildren = (children: number) => {
    const childAges = Array.from({ length: children }, (_, i) => value.childAges[i] ?? DEFAULT_CHILD_AGE);
    onChange({ ...value, children, childAges });
  };
  return (
    <div className="p-2">
      <div className="divide-y divide-[#E3DDD5]">
        <Stepper label="Adults" hint="Age 13+" value={value.adults} min={1} max={12} onChange={(adults) => onChange({ ...value, adults })} />
        <Stepper label="Children" hint="Age 2–12" value={value.children} min={0} max={8} onChange={setChildren} />
        <Stepper label="Infants" hint="Under 2" value={value.infants} min={0} max={4} onChange={(infants) => onChange({ ...value, infants })} />
      </div>
      {value.childAges.length > 0 && (
        <div className="mt-1 grid grid-cols-2 gap-2 border-t border-[#E3DDD5] pt-3">
          {value.childAges.map((age, i) => (
            <label key={i} className="text-[0.8125rem] font-semibold text-[#5E564E]">
              Age of child {i + 1}
              <select
                value={age}
                onChange={(e) => onChange({ ...value, childAges: value.childAges.map((a, k) => (k === i ? Number(e.target.value) : a)) })}
                className="mt-1 block h-11 w-full cursor-pointer rounded-[0.625rem] border border-[#E3DDD5] bg-white px-2 text-[1rem] font-semibold text-[#14110F]"
              >
                {CHILD_AGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          ))}
        </div>
      )}
      {onDone && (
        <div className="mt-3 flex justify-end">
          <button type="button" onClick={onDone} className={DONE_BUTTON}>Done</button>
        </div>
      )}
    </div>
  );
}

export function TravellersPopover({ value, onChange, onDone }: { value: TravellersState; onChange: (next: TravellersState) => void; onDone: () => void }) {
  return (
    <SearchPanel className="left-0 w-80">
      <TravellersContent value={value} onChange={onChange} onDone={onDone} />
    </SearchPanel>
  );
}
