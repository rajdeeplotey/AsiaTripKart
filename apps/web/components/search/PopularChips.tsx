'use client';

const CHIPS = [
  { id: 'bali', name: 'Bali' },
  { id: 'thailand', name: 'Thailand' },
  { id: 'maldives', name: 'Maldives' },
  { id: 'vietnam', name: 'Vietnam' },
  { id: 'japan', name: 'Japan' },
];

export function PopularChips({ onPick }: { onPick: (id: string, name: string) => void }) {
  return (
    // The focus ring is white here because these sit on the photo, where the dark ring would disappear.
    <div className="no-scrollbar -mx-4 mt-3.5 flex snap-x items-center gap-2 overflow-x-auto px-4 py-1 [--focus-ring:#FFFFFF] lg:mx-0 lg:justify-center lg:overflow-visible lg:px-0">
      <span className="shrink-0 snap-start rounded-full px-1.5 py-0.5 text-[0.875rem] font-semibold text-[#E8E2D8] backdrop-brightness-[0.6]">Popular:</span>
      {CHIPS.map((chip) => (
        <a
          key={chip.id}
          href={`/packages?destination=${chip.id}`}
          onClick={(e) => {
            e.preventDefault();
            onPick(chip.id, chip.name);
          }}
          // Darkening the photo behind the chip keeps the white text readable on the brightest slides.
          className="relative shrink-0 snap-start rounded-full border border-white/[0.24] bg-white/[0.14] backdrop-brightness-[0.6] px-3.5 py-[0.4375rem] text-[0.875rem] font-semibold leading-[1.3] text-white transition-colors before:absolute before:inset-x-0 before:-inset-y-1 hover:bg-white/[0.24]"
        >
          {chip.name}
        </a>
      ))}
    </div>
  );
}
