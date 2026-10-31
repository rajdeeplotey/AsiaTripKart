import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, Marcellus, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/header/Header';
import { MobileTabBar } from '@/components/header/MobileTabBar';
import { Footer } from '@/components/Footer';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const marcellus = Marcellus({ subsets: ['latin'], weight: ['400'], variable: '--font-marcellus', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['700'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: { default: 'AsiaVoyage | Tour Packages, Holidays & Things To Do Across Asia', template: '%s | AsiaVoyage' },
  description:
    'Handcrafted holiday packages, honeymoons, group tours and things to do across 48 Asian countries. Local experts, no hidden costs and 24×7 on-trip support.',
  robots: { index: false, follow: false }, // dev preview
};

export const viewport: Viewport = { themeColor: '#0F6B5C' };

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'AsiaVoyage',
  url: 'http://localhost:3000',
  areaServed: 'Asia',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} ${marcellus.variable} ${manrope.variable} ${cormorant.variable}`}>
      <body className="pb-16 lg:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-toast focus:rounded-pill focus:bg-surface focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileTabBar />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
