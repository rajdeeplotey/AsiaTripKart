import Image from 'next/image';
import Link from 'next/link';

const HORIZONTAL = { width: 1600, height: 196 };
const STACKED = { width: 1200, height: 356 };

/**
 * Official AsiaTripKart logo. `inverted` swaps to the white-lettered copy for dark backgrounds.
 * `stacked` is the taller lockup for roomy spots; the default wide lockup fits the header and drawer.
 */
export function Logo({ inverted = false, stacked = false, className = '' }: { inverted?: boolean; stacked?: boolean; className?: string }) {
  if (stacked) {
    return (
      <Link href="/" aria-label="AsiaTripKart home" className="block w-[12.5rem]">
        <Image src={`/brand/asiatripkart-stacked${inverted ? '-white' : ''}.png`} alt="" {...STACKED} sizes="200px" className="h-auto w-full" />
      </Link>
    );
  }
  // Both copies stay mounted so the header can cross-fade between them as it turns solid on scroll.
  return (
    <Link href="/" aria-label="AsiaTripKart home" className={`relative block w-[10.5rem] shrink-0 sm:w-[12.5rem] lg:w-[8.4rem] xl:w-[12.5rem] ${className}`}>
      <Image src="/brand/asiatripkart-horizontal.png" alt="" {...HORIZONTAL} priority sizes="200px" className={`h-auto w-full transition-opacity duration-300 ${inverted ? 'opacity-0' : 'opacity-100'}`} />
      <Image src="/brand/asiatripkart-horizontal-white.png" alt="" {...HORIZONTAL} priority sizes="200px" className={`absolute inset-0 h-auto w-full transition-opacity duration-300 ${inverted ? 'opacity-100' : 'opacity-0'}`} />
    </Link>
  );
}
