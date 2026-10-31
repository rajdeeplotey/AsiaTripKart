'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Heart, House, Luggage, User } from 'lucide-react';

// Mirrors the future app's bottom tabs (sitemap §6).
const TABS = [
  { href: '/', label: 'Home', Icon: House },
  { href: '/tour-packages', label: 'Explore', Icon: Compass },
  { href: '/#trips', label: 'Trips', Icon: Luggage },
  { href: '/#wishlist', label: 'Wishlist', Icon: Heart },
  { href: '/#account', label: 'Account', Icon: User },
];

export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-header border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === path;
          return (
            <li key={label}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? 'text-primary' : 'text-ink-500'}`}
              >
                <Icon aria-hidden className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
