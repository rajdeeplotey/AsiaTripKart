'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, MessageCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useScrolled } from '@/hooks/useScrolled';
import { CurrencyLanguageButton } from './CurrencyLanguageButton';
import { MegaMenu } from './MegaMenu';
import { MobileDrawer } from './MobileDrawer';
import { Logo } from '@/components/ui/Logo';

const SOLID_AFTER_PX = 80;
const WHATSAPP_HREF = 'https://wa.me/911800000000';

/**
 * `transparent` overlays a hero and turns solid after scrolling; `solid` is white from the start.
 * With no `variant`, the home page gets `transparent` and every other page gets `solid`.
 */
export function Header({ variant, savedCount = 0, userName }: { variant?: 'transparent' | 'solid'; savedCount?: number; userName?: string }) {
  const isHome = usePathname() === '/';
  const resolved = variant ?? (isHome ? 'transparent' : 'solid');
  const scrolled = useScrolled(SOLID_AFTER_PX);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const onMenuOpenChange = useCallback((open: boolean) => setMenuOpen(open), []);
  const solid = resolved === 'solid' || scrolled;
  // An open dropdown has always turned the bar white, so that stays part of its effect.
  const transparent = !solid && !menuOpen;

  // Set per element rather than on <header>, so the dropdown panels inside it keep their own font and focus ring.
  const ring = transparent ? 'focus-visible:outline-white' : 'focus-visible:outline-[#14110F]';
  const manrope = '[font-family:var(--font-manrope)]';
  const utilityLink = `flex h-full items-center whitespace-nowrap transition-colors duration-200 ${transparent ? 'hover:text-white' : 'hover:text-[#14110F]'} ${ring}`;
  const round = `relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ${ring}`;
  const savedColors = transparent ? 'bg-white/[0.14] text-white' : 'bg-[#F6F3EF] text-[#14110F]';
  const mobileColors = transparent ? 'bg-white/[0.16] text-white' : 'bg-[#F6F3EF] text-[#14110F]';

  return (
    <>
      {/* The solid header is fixed, so it leaves the page flow; solid pages reserve its height here. */}
      {resolved === 'solid' && <div aria-hidden className="h-header-sticky lg:h-header" />}
      <header className={`inset-x-0 top-0 z-header ${solid ? 'fixed' : 'absolute'} ${scrolled && resolved === 'transparent' ? 'animate-header-in' : ''}`}>
        {transparent && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-44"
            style={{ background: 'linear-gradient(180deg, rgba(8,12,10,0.7) 0%, rgba(8,12,10,0) 100%)' }}
          />
        )}

        {/* Utility bar. Invisible when collapsed so keyboard focus can't land inside it. */}
        <div
          className={`relative z-10 hidden transition-[height,background-color,color] duration-200 lg:block ${manrope} ${
            solid ? 'invisible h-0 overflow-hidden' : 'h-header-utility border-b'
          } ${transparent ? 'border-white/[0.14] text-[#E8E2D8]' : 'border-[#E3DDD5] bg-white text-[#5E564E]'}`}
        >
          <div className="container-av flex h-full items-center justify-between text-[0.8125rem] font-medium">
            <div className="flex h-full items-center gap-6">
              <a href="tel:+911800000000" className={utilityLink}>24×7 · 1800 000 000</a>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={utilityLink}>WhatsApp an expert</a>
            </div>
            <div className="flex h-full items-center gap-5">
              <CurrencyLanguageButton className={utilityLink} />
              <Link href="/#footer" className={utilityLink}>Find an office</Link>
              <Link href="/#login" className={utilityLink}>{userName ?? 'Log in'}</Link>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className={`transition-[background-color,box-shadow] duration-200 ${transparent ? '' : 'bg-white shadow-[0_2px_16px_rgba(0,0,0,0.08)]'}`}>
          <div className="container-av relative flex h-header-sticky items-center justify-between gap-5 lg:h-header">
            <Logo inverted={transparent} className={ring} />

            <MegaMenu inverted={transparent} onOpenChange={onMenuOpenChange} />

            <div className={`hidden shrink-0 items-center gap-3 lg:flex ${manrope}`}>
              <Link href="/#wishlist" aria-label={savedCount > 0 ? `Saved trips, ${savedCount} saved` : 'Saved trips'} className={`${round} ${savedColors}`}>
                <Heart aria-hidden size={18} />
                {savedCount > 0 && (
                  <span aria-hidden className="absolute -right-0.5 -top-0.5 grid h-[1.125rem] min-w-[1.125rem] place-items-center rounded-full bg-[#C4401A] px-1 text-[0.6875rem] font-bold leading-none text-white">
                    {savedCount}
                  </span>
                )}
              </Link>
              <Link
                href="/#plan-my-trip"
                className={`flex h-11 items-center whitespace-nowrap rounded-[1.375rem] border-[1.5px] px-5 text-[0.9375rem] font-semibold transition-colors duration-200 ${ring} ${
                  transparent ? 'border-white/70 text-white hover:bg-white/[0.12]' : 'border-[#14110F] text-[#14110F] hover:bg-[#F6F3EF]'
                }`}
              >
                Talk to an expert
              </Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 lg:hidden">
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp an expert" className={`${round} ${mobileColors}`}>
                <MessageCircle aria-hidden size={20} />
              </a>
              <button type="button" aria-label="Open menu" onClick={() => setDrawerOpen(true)} className={`${round} ${mobileColors}`}>
                <Menu aria-hidden size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
