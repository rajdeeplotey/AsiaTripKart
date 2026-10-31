// Sample content shaped like the /v1 API responses (see apps/api/openapi/openapi.yaml).
// Replaced by the generated api-client once the API's content and destination endpoints ship (backlog E3-6, E3-7).
// Prices here are whole rupees for readability; the API returns minor units.

export type NavLink = { label: string; href: string; flag?: string; badge?: 'new' | 'hot'; from?: number };
export type NavColumn = { heading: string; links: NavLink[] };
export type NavPromo =
  | { kind: 'card'; title: string; subtitle: string; photo: string; href: string; from: number }
  | { kind: 'carousel'; title: string; packageSlugs: string[] }
  | { kind: 'countdown'; title: string; subtitle: string; endsAt: string; href: string };
export type NavItem = { id: string; label: string; href: string; columns?: NavColumn[]; promo?: NavPromo };

export const DEAL_ENDS_AT = '2026-11-15T23:59:59+05:30';

export const navigation: NavItem[] = [
  {
    id: 'destinations',
    label: 'Destinations',
    href: '/tour-packages',
    columns: [
      {
        heading: 'South-East Asia',
        links: [
          { label: 'Thailand', href: '/tour-packages?q=Thailand', flag: '🇹🇭', badge: 'hot', from: 32999 },
          { label: 'Bali, Indonesia', href: '/tour-packages?q=Bali', flag: '🇮🇩', from: 38999 },
          { label: 'Vietnam', href: '/tour-packages?q=Vietnam', flag: '🇻🇳', badge: 'new', from: 44999 },
          { label: 'Singapore', href: '/tour-packages?q=Singapore', flag: '🇸🇬', from: 42999 },
          { label: 'Malaysia', href: '/tour-packages?q=Malaysia', flag: '🇲🇾', from: 34999 },
          { label: 'Cambodia', href: '/tour-packages?q=Cambodia', flag: '🇰🇭', from: 36999 },
        ],
      },
      {
        heading: 'South & East Asia',
        links: [
          { label: 'Maldives', href: '/tour-packages?q=Maldives', flag: '🇲🇻', badge: 'hot', from: 64999 },
          { label: 'Sri Lanka', href: '/tour-packages?q=Sri Lanka', flag: '🇱🇰', from: 39999 },
          { label: 'Nepal', href: '/tour-packages?q=Nepal', flag: '🇳🇵', from: 27999 },
          { label: 'Bhutan', href: '/tour-packages?q=Bhutan', flag: '🇧🇹', from: 58999 },
          { label: 'Japan', href: '/tour-packages?q=Japan', flag: '🇯🇵', badge: 'new', from: 124999 },
          { label: 'South Korea', href: '/tour-packages?q=Korea', flag: '🇰🇷', from: 98999 },
        ],
      },
      {
        heading: 'Central & West Asia',
        links: [
          { label: 'Dubai, UAE', href: '/tour-packages?q=Dubai', flag: '🇦🇪', from: 41999 },
          { label: 'Uzbekistan', href: '/tour-packages?q=Uzbekistan', flag: '🇺🇿', badge: 'new', from: 69999 },
          { label: 'Georgia', href: '/tour-packages?q=Georgia', flag: '🇬🇪', from: 74999 },
          { label: 'Turkey', href: '/tour-packages?q=Turkey', flag: '🇹🇷', from: 89999 },
          { label: 'Jordan', href: '/tour-packages?q=Jordan', flag: '🇯🇴', from: 94999 },
          { label: 'Kazakhstan', href: '/tour-packages?q=Kazakhstan', flag: '🇰🇿', from: 59999 },
        ],
      },
    ],
    promo: { kind: 'card', title: 'Trending this month', subtitle: 'Vietnam in 7 nights', photo: 'halong', href: '/tour-packages?q=Vietnam', from: 44999 },
  },
  {
    id: 'packages',
    label: 'Holidays',
    href: '/tour-packages',
    columns: [
      {
        heading: 'Long breaks · 7–15 nights',
        links: [
          { label: 'Grand Japan Circuit', href: '/tour-packages?q=Japan' },
          { label: 'Vietnam North to South', href: '/tour-packages?q=Vietnam' },
          { label: 'Silk Road Uzbekistan', href: '/tour-packages?q=Uzbekistan' },
          { label: 'Sri Lanka Complete', href: '/tour-packages?q=Sri Lanka' },
        ],
      },
      {
        heading: 'Short breaks · 3–6 nights',
        links: [
          { label: 'Dubai Getaway', href: '/tour-packages?q=Dubai' },
          { label: 'Phuket & Krabi', href: '/tour-packages?q=Thailand' },
          { label: 'Singapore City Break', href: '/tour-packages?q=Singapore' },
          { label: 'Kathmandu & Pokhara', href: '/tour-packages?q=Nepal' },
        ],
      },
      {
        heading: 'By theme',
        links: [
          { label: 'Family holidays', href: '/tour-packages?theme=family' },
          { label: 'Luxury escapes', href: '/tour-packages?theme=luxury' },
          { label: 'Adventure', href: '/tour-packages?theme=adventure', badge: 'hot' },
          { label: 'Pilgrimage & spiritual', href: '/tour-packages?theme=pilgrimage' },
        ],
      },
    ],
    promo: { kind: 'carousel', title: 'Top picks', packageSlugs: ['japan-cherry-blossom-trail', 'bali-ubud-seminyak-escape', 'vietnam-hanoi-halong-hoian'] },
  },
  {
    id: 'honeymoon',
    label: 'Honeymoons',
    href: '/tour-packages?theme=honeymoon',
    columns: [
      {
        heading: 'Beach',
        links: [
          { label: 'Maldives', href: '/tour-packages?q=Maldives', flag: '🇲🇻', from: 64999 },
          { label: 'Bali', href: '/tour-packages?q=Bali', flag: '🇮🇩', from: 38999 },
          { label: 'Phuket & Krabi', href: '/tour-packages?q=Thailand', flag: '🇹🇭', from: 32999 },
        ],
      },
      {
        heading: 'Mountains',
        links: [
          { label: 'Kashmir', href: '/tour-packages?q=Kashmir', flag: '🇮🇳', from: 24999 },
          { label: 'Bhutan', href: '/tour-packages?q=Bhutan', flag: '🇧🇹', from: 58999 },
          { label: 'Nepal', href: '/tour-packages?q=Nepal', flag: '🇳🇵', from: 27999 },
        ],
      },
      {
        heading: 'Luxury & cities',
        links: [
          { label: 'Dubai', href: '/tour-packages?q=Dubai', flag: '🇦🇪', from: 41999 },
          { label: 'Japan', href: '/tour-packages?q=Japan', flag: '🇯🇵', from: 124999 },
          { label: 'Singapore', href: '/tour-packages?q=Singapore', flag: '🇸🇬', from: 42999 },
        ],
      },
    ],
    promo: { kind: 'card', title: 'Honeymoon deal of the week', subtitle: 'Maldives water villa, 4 nights', photo: 'maldives', href: '/tour-packages?q=Maldives', from: 89999 },
  },
  { id: 'things', label: 'Experiences', href: '/#things-to-do' },
  { id: 'stays', label: 'Stays', href: '/#stays' },
  {
    id: 'deals',
    label: 'Deals',
    href: '/#deals',
    columns: [
      { heading: 'Last-minute', links: [{ label: 'Departing in 30 days', href: '/#deals', badge: 'hot' }, { label: 'Weekend getaways', href: '/#deals' }] },
      { heading: 'Early-bird', links: [{ label: 'Book 90 days ahead, save 15%', href: '/#deals' }, { label: 'Cherry blossom 2027', href: '/#deals', badge: 'new' }] },
      { heading: 'By budget', links: [{ label: 'Under ₹50,000', href: '/tour-packages?max=50000' }, { label: 'Under ₹1 lakh', href: '/tour-packages?max=100000' }] },
    ],
    promo: { kind: 'countdown', title: 'Winter Sale', subtitle: 'Up to 30% off Asia packages', endsAt: DEAL_ENDS_AT, href: '/#deals' },
  },
];

export type Region = { slug: string; name: string; photo: string; countries: number; from: number };
export const regions: Region[] = [
  { slug: 'south-east-asia', name: 'South-East Asia', photo: 'r_sea', countries: 11, from: 29999 },
  { slug: 'south-asia', name: 'South Asia', photo: 'r_south', countries: 8, from: 18999 },
  { slug: 'east-asia', name: 'East Asia', photo: 'r_east', countries: 7, from: 74999 },
  { slug: 'central-asia', name: 'Central Asia', photo: 'r_central', countries: 5, from: 59999 },
  { slug: 'middle-east', name: 'Middle East', photo: 'r_west', countries: 18, from: 41999 },
  { slug: 'north-asia', name: 'North Asia', photo: 'r_north', countries: 1, from: 119999 },
];

export type Destination = { name: string; country: string; photo: string; from: number; packages: number; bestMonths: number[] };
export const destinations: Destination[] = [
  { name: 'Thailand', country: 'South-East Asia', photo: 'phiphi', from: 32999, packages: 148, bestMonths: [11, 12, 1, 2, 3] },
  { name: 'Bali', country: 'Indonesia', photo: 'bali', from: 38999, packages: 112, bestMonths: [4, 5, 6, 7, 8, 9] },
  { name: 'Vietnam', country: 'South-East Asia', photo: 'halong', from: 44999, packages: 86, bestMonths: [2, 3, 4, 10, 11] },
  { name: 'Japan', country: 'East Asia', photo: 'fuji', from: 124999, packages: 64, bestMonths: [3, 4, 10, 11] },
  { name: 'Maldives', country: 'South Asia', photo: 'maldives', from: 64999, packages: 95, bestMonths: [11, 12, 1, 2, 3, 4] },
  { name: 'Dubai', country: 'UAE', photo: 'dubai', from: 41999, packages: 130, bestMonths: [11, 12, 1, 2, 3] },
  { name: 'Singapore', country: 'South-East Asia', photo: 'singapore', from: 42999, packages: 77, bestMonths: [2, 3, 4, 7, 8] },
  { name: 'Sri Lanka', country: 'South Asia', photo: 'srilanka', from: 39999, packages: 58, bestMonths: [12, 1, 2, 3, 4] },
  { name: 'Bhutan', country: 'South Asia', photo: 'bhutan', from: 58999, packages: 31, bestMonths: [3, 4, 5, 10, 11] },
  { name: 'Georgia', country: 'Caucasus', photo: 'georgia', from: 74999, packages: 22, bestMonths: [5, 6, 9, 10] },
  { name: 'Uzbekistan', country: 'Central Asia', photo: 'uzbek', from: 69999, packages: 18, bestMonths: [4, 5, 9, 10] },
  { name: 'Kashmir', country: 'India', photo: 'kashmir', from: 24999, packages: 74, bestMonths: [4, 5, 6, 9, 10] },
  { name: 'Kerala', country: 'India', photo: 'kerala', from: 21999, packages: 69, bestMonths: [10, 11, 12, 1, 2, 3] },
  { name: 'Nepal', country: 'South Asia', photo: 'nepal', from: 27999, packages: 47, bestMonths: [10, 11, 3, 4] },
  { name: 'Jordan', country: 'Middle East', photo: 'jordan', from: 94999, packages: 15, bestMonths: [3, 4, 10, 11] },
];

export type Inclusion = 'hotel' | 'meals' | 'transfers' | 'sightseeing' | 'flights';
export type Package = {
  slug: string;
  title: string;
  country: string;
  nights: number;
  route: Array<{ city: string; nights: number }>;
  photos: string[];
  inclusions: Inclusion[];
  rating: number;
  reviews: number;
  price: number;
  compareAt: number;
  themes: string[];
  badge?: 'Best seller' | 'Trending';
  bookedThisWeek?: number;
};

/** Free-text package match shared by the hero search count and the listing page. */
export function matchesQuery(p: Package, q?: string) {
  const needle = q?.trim().toLowerCase();
  return (
    !needle ||
    p.country.toLowerCase().includes(needle) ||
    p.title.toLowerCase().includes(needle) ||
    p.route.some((r) => r.city.toLowerCase().includes(needle))
  );
}

export const packages: Package[] = [
  {
    slug: 'phuket-krabi-island-hopper', title: 'Phuket & Krabi Island Hopper', country: 'Thailand', nights: 5,
    route: [{ city: 'Phuket', nights: 3 }, { city: 'Krabi', nights: 2 }], photos: ['phiphi', 'krabi', 'act_bangkok'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.7, reviews: 1284, price: 32999, compareAt: 41999,
    themes: ['honeymoon', 'family', 'budget'], badge: 'Best seller', bookedThisWeek: 41,
  },
  {
    slug: 'bali-ubud-seminyak-escape', title: 'Bali: Ubud & Seminyak Escape', country: 'Bali Indonesia', nights: 6,
    route: [{ city: 'Ubud', nights: 3 }, { city: 'Seminyak', nights: 3 }], photos: ['bali', 'act_nusa'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing', 'flights'], rating: 4.8, reviews: 962, price: 48999, compareAt: 58999,
    themes: ['honeymoon', 'wellness'], badge: 'Trending', bookedThisWeek: 27,
  },
  {
    slug: 'vietnam-hanoi-halong-hoian', title: 'Vietnam: Hanoi, Ha Long Bay & Hoi An', country: 'Vietnam', nights: 7,
    route: [{ city: 'Hanoi', nights: 2 }, { city: 'Ha Long', nights: 1 }, { city: 'Hoi An', nights: 4 }], photos: ['halong', 'hoian'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.8, reviews: 418, price: 54999, compareAt: 64999,
    themes: ['family', 'adventure'], bookedThisWeek: 19,
  },
  {
    slug: 'japan-cherry-blossom-trail', title: 'Japan Cherry Blossom Trail', country: 'Japan', nights: 8,
    route: [{ city: 'Tokyo', nights: 3 }, { city: 'Hakone', nights: 1 }, { city: 'Kyoto', nights: 3 }, { city: 'Osaka', nights: 1 }], photos: ['fuji', 'act_inari', 'r_east'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.9, reviews: 233, price: 164999, compareAt: 184999,
    themes: ['luxury', 'festival'], badge: 'Trending', bookedThisWeek: 12,
  },
  {
    slug: 'maldives-water-villa-retreat', title: 'Maldives Water Villa Retreat', country: 'Maldives', nights: 4,
    route: [{ city: 'South Malé Atoll', nights: 4 }], photos: ['maldives'],
    inclusions: ['hotel', 'meals', 'transfers'], rating: 4.9, reviews: 541, price: 89999, compareAt: 109999,
    themes: ['honeymoon', 'luxury'], badge: 'Best seller', bookedThisWeek: 33,
  },
  {
    slug: 'dubai-city-desert-getaway', title: 'Dubai City & Desert Getaway', country: 'Dubai UAE', nights: 4,
    route: [{ city: 'Dubai', nights: 4 }], photos: ['dubai', 'act_desert'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing', 'flights'], rating: 4.6, reviews: 2210, price: 41999, compareAt: 49999,
    themes: ['family', 'luxury'], badge: 'Best seller', bookedThisWeek: 58,
  },
  {
    slug: 'sri-lanka-hill-country-coast', title: 'Sri Lanka: Hill Country & South Coast', country: 'Sri Lanka', nights: 6,
    route: [{ city: 'Kandy', nights: 2 }, { city: 'Ella', nights: 2 }, { city: 'Bentota', nights: 2 }], photos: ['srilanka'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.7, reviews: 307, price: 39999, compareAt: 46999,
    themes: ['family', 'wildlife'], bookedThisWeek: 14,
  },
  {
    slug: 'silk-road-samarkand-bukhara', title: 'Silk Road: Tashkent, Samarkand & Bukhara', country: 'Uzbekistan', nights: 7,
    route: [{ city: 'Tashkent', nights: 2 }, { city: 'Samarkand', nights: 3 }, { city: 'Bukhara', nights: 2 }], photos: ['r_central', 'uzbek'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.8, reviews: 96, price: 79999, compareAt: 92999,
    themes: ['adventure', 'luxury'], bookedThisWeek: 7,
  },
  {
    slug: 'kashmir-paradise-on-earth', title: 'Kashmir: Srinagar, Gulmarg & Pahalgam', country: 'Kashmir India', nights: 5,
    route: [{ city: 'Srinagar', nights: 2 }, { city: 'Gulmarg', nights: 1 }, { city: 'Pahalgam', nights: 2 }], photos: ['kashmir', 'plan'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.6, reviews: 1890, price: 24999, compareAt: 31999,
    themes: ['honeymoon', 'family'], bookedThisWeek: 46,
  },
  {
    slug: 'bhutan-happiness-trail', title: "Bhutan: Thimphu, Punakha & Tiger's Nest", country: 'Bhutan', nights: 6,
    route: [{ city: 'Thimphu', nights: 2 }, { city: 'Punakha', nights: 2 }, { city: 'Paro', nights: 2 }], photos: ['bhutan'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.9, reviews: 178, price: 68999, compareAt: 76999,
    themes: ['pilgrimage', 'adventure', 'wellness'], bookedThisWeek: 9,
  },
  {
    slug: 'nepal-kathmandu-pokhara', title: 'Nepal: Kathmandu & Pokhara', country: 'Nepal', nights: 5,
    route: [{ city: 'Kathmandu', nights: 2 }, { city: 'Pokhara', nights: 3 }], photos: ['nepal', 'r_south'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.6, reviews: 402, price: 27999, compareAt: 33999,
    themes: ['pilgrimage', 'adventure', 'budget'], bookedThisWeek: 16,
  },
  {
    slug: 'kerala-backwaters-hills', title: 'Kerala: Munnar, Thekkady & Backwaters', country: 'Kerala India', nights: 5,
    route: [{ city: 'Munnar', nights: 2 }, { city: 'Thekkady', nights: 1 }, { city: 'Alleppey', nights: 2 }], photos: ['kerala'],
    inclusions: ['hotel', 'meals', 'transfers', 'sightseeing'], rating: 4.7, reviews: 1120, price: 21999, compareAt: 26999,
    themes: ['family', 'wellness', 'honeymoon'], bookedThisWeek: 22,
  },
];

export const themes = [
  { slug: 'honeymoon', name: 'Honeymoon', icon: 'Heart' },
  { slug: 'family', name: 'Family', icon: 'Users' },
  { slug: 'adventure', name: 'Adventure', icon: 'Mountain' },
  { slug: 'luxury', name: 'Luxury', icon: 'Gem' },
  { slug: 'pilgrimage', name: 'Pilgrimage', icon: 'Landmark' },
  { slug: 'wellness', name: 'Wellness', icon: 'Flower2' },
  { slug: 'festival', name: 'Festivals', icon: 'PartyPopper' },
  { slug: 'wildlife', name: 'Wildlife', icon: 'Binoculars' },
  { slug: 'cruise', name: 'Cruises', icon: 'Ship' },
] as const;

export type Activity = {
  title: string; city: string; photo: string; duration: string; rating: number; reviews: number;
  price: number; instant: boolean; freeCancel: boolean;
};
export const activities: Activity[] = [
  { title: 'Desert safari with dune bashing & BBQ dinner', city: 'Dubai', photo: 'act_desert', duration: '6 hours', rating: 4.7, reviews: 8421, price: 2499, instant: true, freeCancel: true },
  { title: 'Gardens by the Bay: Flower Dome & Supertree Grove', city: 'Singapore', photo: 'act_gardens', duration: '3 hours', rating: 4.8, reviews: 5310, price: 1899, instant: true, freeCancel: false },
  { title: 'Fushimi Inari & Kyoto temples guided walk', city: 'Kyoto', photo: 'act_inari', duration: '5 hours', rating: 4.9, reviews: 1204, price: 4299, instant: false, freeCancel: true },
  { title: 'Nusa Penida west coast day trip by speedboat', city: 'Bali', photo: 'act_nusa', duration: '10 hours', rating: 4.6, reviews: 3077, price: 3199, instant: true, freeCancel: true },
  { title: 'Grand Palace & Wat Pho morning tour', city: 'Bangkok', photo: 'act_bangkok', duration: '4 hours', rating: 4.7, reviews: 2648, price: 1599, instant: true, freeCancel: true },
  { title: 'Seoul by night: N Seoul Tower & Myeongdong', city: 'Seoul', photo: 'act_seoul', duration: '4 hours', rating: 4.6, reviews: 912, price: 3499, instant: true, freeCancel: true },
];

export const valueProps = [
  { icon: 'MapPinned', title: 'Local experts', body: 'Trips planned by specialists who live in the destinations they design.' },
  { icon: 'BadgeIndianRupee', title: 'Best-price promise', body: 'Find the same trip cheaper within 24 hours and we will match it.' },
  { icon: 'ReceiptText', title: 'No hidden costs', body: 'Taxes, transfers and entry fees are shown up front, not at checkout.' },
  { icon: 'Headset', title: '24×7 on-trip support', body: 'A real person on WhatsApp or phone, in your time zone, the whole trip.' },
  { icon: 'WalletCards', title: 'Flexible payments', body: 'Pay 25% to book, then the rest in instalments or no-cost EMI.' },
  { icon: 'ShieldCheck', title: 'Secure & licensed', body: 'Bank-grade payments, verified suppliers and full financial protection.' },
] as const;

// Sample reviews for layout only; replaced by verified traveller reviews (Review model) before launch.
export const reviews = [
  { name: 'Aditi R.', trip: 'Bali: Ubud & Seminyak Escape', rating: 5, photo: 'bali', body: 'Every transfer was on time and the Ubud villa was even better than the photos. The team re-planned our Nusa Penida day when the sea was rough.' },
  { name: 'Karan & Mehak', trip: 'Maldives Water Villa Retreat', rating: 5, photo: 'maldives', body: 'Seamless honeymoon. Seaplane, villa upgrade and a surprise dinner on the sandbank were all arranged without us asking twice.' },
  { name: 'The Iyer family', trip: 'Vietnam: Hanoi, Ha Long Bay & Hoi An', rating: 4, photo: 'hoian', body: 'Great pacing for kids and grandparents. The Ha Long overnight cruise was the highlight. One hotel in Hanoi was a bit far from the old quarter.' },
];

export const stories = [
  { title: 'The best time to visit Japan for cherry blossoms in 2027', tag: 'Guides', photo: 'fuji', minutes: 8 },
  { title: '10 days in Uzbekistan: a Silk Road itinerary', tag: 'Itineraries', photo: 'r_central', minutes: 12 },
  { title: 'Bhutan for first-timers: permits, SDF and what to pack', tag: 'Know before you go', photo: 'bhutan', minutes: 6 },
];

// `focus` is the photo's subject (CSS object-position), so narrow screens crop around it rather than the centre.
export const heroSlides = [
  // Same order as TYPEWRITER_WORDS, so the first word typed matches the photo already on screen.
  { photo: 'phiphi', name: 'Phi Phi Islands', country: 'Thailand', focus: '50% 50%' },
  { photo: 'hero_japan', name: 'Mount Fuji', country: 'Japan', focus: '45% 100%' },
  { photo: 'hero_taj', name: 'Taj Mahal', country: 'India', focus: '50% 50%' },
  { photo: 'hero_maldives', name: 'Turquoise lagoon', country: 'Maldives', focus: '40% 60%' },
  { photo: 'hero_dubai', name: 'Dubai skyline', country: 'UAE', focus: '55% 50%' },
  { photo: 'hero_vietnam', name: 'Lan Ha Bay', country: 'Vietnam', focus: '60% 50%' },
  { photo: 'hero_singapore', name: 'Marina Bay Sands', country: 'Singapore', focus: '48% 50%' },
];

// DEMO VALUES: replace with the real figures before launch. The IATA number is an obvious placeholder on purpose.
export const heroTrust = {
  rating: 4.8,
  reviewCount: 12400,
  reviewsUrl: 'https://www.google.com/maps',
  travellers: '200,000+',
  iataNumber: 'IATA 00000000',
};

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatINR(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function discountPercent(price: number, compareAt: number) {
  return Math.round((1 - price / compareAt) * 100);
}
