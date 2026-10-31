import Link from 'next/link';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

const COLUMNS = [
  { heading: 'Top destinations', links: ['Thailand', 'Bali', 'Maldives', 'Dubai', 'Japan', 'Vietnam', 'Singapore', 'Sri Lanka'].map((d) => ({ label: `${d} packages`, href: `/tour-packages?q=${encodeURIComponent(d)}` })) },
  { heading: 'Holidays by theme', links: ['Honeymoon', 'Family', 'Adventure', 'Luxury', 'Pilgrimage', 'Wellness', 'Group tours'].map((t) => ({ label: t, href: `/tour-packages?theme=${t.toLowerCase().replace(' ', '-')}` })) },
  { heading: 'Company', links: [{ label: 'About us', href: '/#about' }, { label: 'Careers', href: '/#careers' }, { label: 'Travel stories', href: '/#stories' }, { label: 'Photo credits', href: '/credits' }], then: { heading: 'For business', links: [{ label: 'MICE & corporate', href: '/#plan-my-trip' }] } },
  { heading: 'Support', links: [{ label: 'Contact us', href: '/#footer' }, { label: 'Cancellation policy', href: '/#legal' }, { label: 'Terms & conditions', href: '/#legal' }, { label: 'Privacy policy', href: '/#legal' }, { label: 'Grievance officer', href: '/#legal' }] },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-ink-900 text-white/80">
      <div className="container-av grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo inverted stacked />
          <p className="mt-4 max-w-xs text-small">Premium holidays and experiences across Asia, planned by local experts.</p>
          <ul className="mt-6 space-y-3 text-small">
            <li><a href="tel:+911800000000" className="flex items-center gap-2 hover:text-white"><Phone aria-hidden className="h-4 w-4" /> 1800 000 000 (24×7)</a></li>
            <li><a href="https://wa.me/911800000000" className="flex items-center gap-2 hover:text-white"><MessageCircle aria-hidden className="h-4 w-4" /> WhatsApp</a></li>
            <li><a href="mailto:hello@asiavoyage.example" className="flex items-center gap-2 hover:text-white"><Mail aria-hidden className="h-4 w-4" /> hello@asiavoyage.example</a></li>
            <li className="flex items-center gap-2"><MapPin aria-hidden className="h-4 w-4" /> New Delhi · Mumbai · Dubai · Singapore</li>
          </ul>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.heading} aria-label={c.heading}>
            <p className="font-semibold text-white">{c.heading}</p>
            <ul className="mt-4 space-y-2.5 text-small">
              {c.links.map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-white hover:underline">{l.label}</Link></li>
              ))}
            </ul>
            {c.then && (
              <>
                <p className="mt-6 font-semibold text-white">{c.then.heading}</p>
                <ul className="mt-4 space-y-2.5 text-small">
                  {c.then.links.map((l) => (
                    <li key={l.label}><Link href={l.href} className="hover:text-white hover:underline">{l.label}</Link></li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-av flex flex-col gap-3 py-6 text-micro sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AsiaVoyage (working title). Preview build with sample content.</p>
          <p className="flex flex-wrap gap-4">
            <span>Instagram</span><span>YouTube</span><span>Facebook</span><span>LinkedIn</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
