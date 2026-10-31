import { ChevronRight, Headphones, Pause, Play, ShieldCheck, Star, User } from 'lucide-react';

export type HeroTrustSlide = { name: string; country: string };

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const ROUND_BUTTON = `grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ${FOCUS}`;
const ICON = { size: 17, strokeWidth: 2, 'aria-hidden': true } as const;
// Below 640px only the rating and support items stay visible.
const WIDE_ONLY_ITEM = 'hidden items-center gap-2 min-[640px]:flex';

export function HeroTrustBar({
  slides,
  currentIndex,
  isPaused,
  onNext,
  onTogglePause,
  rating,
  reviewCount,
  reviewsUrl,
  travellers,
  iataNumber,
}: {
  slides: HeroTrustSlide[];
  currentIndex: number;
  isPaused: boolean;
  onNext: () => void;
  onTogglePause: () => void;
  rating: number;
  reviewCount: number;
  reviewsUrl: string;
  travellers: string;
  iataNumber: string;
}) {
  const current = slides[currentIndex];
  const reviews = reviewCount.toLocaleString('en-IN');

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[12.5rem]"
        style={{ background: 'linear-gradient(0deg, rgba(8,12,10,0.8) 0%, transparent 100%)' }}
      />
      {/* The list shrinks and wraps instead of the row, so the controls always stay on the right. */}
      <div className="container-av flex items-center justify-between gap-5 pb-7 [font-family:var(--font-manrope)]">
        <ul className="flex min-w-0 flex-wrap items-center gap-x-7 gap-y-3 text-[0.875rem] font-semibold text-[#F3EEE6]">
          <li>
            {/* The pseudo-element extends the tap area to 44px without making the pill itself taller. */}
            <a
              href={reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-[0.625rem] bg-white px-3 py-1.5 text-[#14110F] before:absolute before:inset-x-0 before:-inset-y-1.5 ${FOCUS}`}
            >
              <span aria-hidden className="font-extrabold text-[#1A73E8]">G</span>
              <span className="font-extrabold">{rating.toFixed(1)}</span>
              <span className="sr-only"> out of 5 on Google, </span>
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={13} className="fill-[#B7791F] text-[#B7791F]" aria-hidden />
                ))}
              </span>
              <span className="text-[#5E564E]">{reviews} reviews</span>
            </a>
          </li>
          <li className={WIDE_ONLY_ITEM}>
            <User {...ICON} /> {travellers} travellers
          </li>
          <li className="flex items-center gap-2">
            <Headphones {...ICON} /> 24×7 on-trip support
          </li>
          <li className={WIDE_ONLY_ITEM}>
            <ShieldCheck {...ICON} /> Secure payments · {iataNumber}
          </li>
        </ul>

        <div className="flex shrink-0 items-center gap-3.5">
          {/* Fixed size, so a longer destination name can't re-wrap the bar or shift the hero as the slides change.
              Hidden until 768px because below that it would push the trust items past two lines. */}
          {current && (
            <p className="hidden min-h-[3.375rem] w-32 flex-col justify-center text-right md:flex lg:w-44">
              <span className="block text-[0.75rem] text-[#E8E2D8]">Now showing</span>
              <span className="block text-[0.875rem] font-bold leading-tight text-white">{current.name}, {current.country}</span>
            </p>
          )}
          <button
            type="button"
            aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
            onClick={onTogglePause}
            className={`${ROUND_BUTTON} border border-white/40 bg-[rgba(14,18,15,0.4)] text-white hover:bg-[rgba(14,18,15,0.65)]`}
          >
            {isPaused ? <Play {...ICON} /> : <Pause {...ICON} />}
          </button>
          <button
            type="button"
            aria-label="Next destination"
            onClick={onNext}
            className={`${ROUND_BUTTON} bg-white text-[#14110F] hover:bg-[#E8E2D8]`}
          >
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
    </>
  );
}
