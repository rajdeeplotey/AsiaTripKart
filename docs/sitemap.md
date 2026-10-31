# AsiaVoyage — Sitemap & URL Contract

Status: Draft v0.1 · 2026-10-29 · Owner: SEO & Content + Web Experience

URLs are a public contract: the web, the iOS/Android apps (Universal Links / App Links) and the sitemaps all use the same paths. Every slug is data in PostgreSQL (`slug` column), never hard-coded. Changing a slug writes a 301 into the `Redirect` table automatically.

Rendering key: **ISR** = static, revalidated on CMS/inventory webhook (+ time fallback) · **SSR** = per-request · **CSR** = client-only, `noindex`.

## 1. Public, indexable

| URL pattern | Template | Render | Index | JSON-LD |
|---|---|---|---|---|
| `/` | Home (14 CMS blocks) | ISR 5 min | yes | Organization, WebSite + SearchAction |
| `/asia` | All regions hub | ISR | yes | BreadcrumbList, ItemList |
| `/asia/{region}` (e.g. `/asia/south-east-asia`) | Region | ISR | yes | BreadcrumbList, ItemList, FAQPage |
| `/asia/{region}/{country}` → canonical short form `/asia/{country}` | Country | ISR | yes | TouristDestination, BreadcrumbList, FAQPage |
| `/asia/{country}/{city}` | City / area | ISR | yes | TouristDestination, BreadcrumbList |
| `/asia/{country}/tour-packages` | Package listing (country) | ISR + SSR filters | yes | ItemList, BreadcrumbList |
| `/asia/{country}/{city}/tour-packages` | Package listing (city) | ISR + SSR filters | yes | ItemList |
| `/asia/{country}/best-time-to-visit` | Seasonality guide | ISR | yes | Article, FAQPage |
| `/asia/{country}/visa` | Visa info + add-on CTA | ISR | yes | FAQPage |
| `/tour-packages` | All packages | ISR + SSR filters | yes | ItemList |
| `/tour-packages/{theme}` (honeymoon, family, adventure, luxury, budget, pilgrimage, wellness, cruise, festival, wildlife, solo, women-only, group-tours) | Theme collection | ISR | yes | ItemList |
| `/tour-packages/{theme}/{country}` (e.g. `/tour-packages/honeymoon/maldives`) | Theme × country | ISR | yes | ItemList |
| `/package/{slug}` | Package detail | ISR 10 min + live price island | yes | TouristTrip, Product, Offer, AggregateRating, FAQPage, BreadcrumbList |
| `/things-to-do` | Activities hub | ISR | yes | ItemList |
| `/things-to-do/{city}` (e.g. `/things-to-do/bali`) | Activities in city | ISR + SSR filters | yes | ItemList |
| `/things-to-do/{city}/{category}` (tours, attractions, theme-parks, shows, water-sports…) | Activity category | ISR | yes | ItemList |
| `/activity/{slug}` | Activity detail | ISR + live availability island | yes | Product, Offer, AggregateRating, TouristAttraction |
| `/stays` · `/stays/{city}` | Stays listing | ISR + SSR filters | yes | ItemList |
| `/stay/{slug}` | Stay detail | ISR + live rates island | yes | LodgingBusiness / Hotel, AggregateRating |
| `/transfers` · `/transfers/{city}` | Transfers & car-with-driver | ISR | yes | Product, Offer |
| `/rail-passes` · `/rail-passes/{slug}` | Rail passes (e.g. JR Pass) | ISR | yes | Product, Offer |
| `/travel-essentials/{visa\|insurance\|esim\|forex}` | Add-on landing pages | ISR | yes | Product / Service |
| `/deals` · `/deals/{last-minute\|early-bird\|under-50k\|under-1-lakh}` | Deals | ISR 5 min | yes | ItemList, Offer |
| `/where-to-go-in-{month}` (12 pages) | Seasonal picks | ISR daily | yes | ItemList, Article |
| `/{country}-packages-from-{city}` | Programmatic SEO (Phase 3) | ISR | only if ≥ N unique packages + editorial intro | ItemList |
| `/{country}-{theme}-packages-under-{amount}` | Programmatic SEO (Phase 3) | ISR | same quality gate | ItemList |
| `/blog` · `/blog/category/{slug}` · `/blog/{slug}` | Travel stories / guides | ISR | yes | Article, BreadcrumbList, Person (author) |
| `/blog/author/{slug}` | Author page (E-E-A-T) | ISR | yes | Person |
| `/reviews` | Verified reviews | ISR | yes | AggregateRating |
| `/plan-my-trip` | Build-my-trip form | SSR | yes | — |
| `/mice` · `/mice/{corporate\|school-groups\|weddings\|incentives}` | MICE | ISR | yes | Service |
| `/about` · `/contact` · `/offices` · `/careers` · `/careers/{slug}` · `/press` | Company | ISR | yes | Organization, JobPosting |
| `/legal/{terms\|privacy\|cancellation\|cookies\|grievance}` | Legal | ISR | yes | — |

**Filtered listings:** query params (`?duration=5-7&budget=0-60000&theme=honeymoon&month=2027-02&sort=price_asc`) render server-side, canonicalise to the unfiltered path, and are `noindex,follow` unless whitelisted as a programmatic landing page. Pagination: `?page=n` with self-referencing canonical. The apps use cursor pagination on the API; the web uses page numbers for crawlability.

## 2. Transactional & account (`noindex`)

| URL | Purpose | Render |
|---|---|---|
| `/search?q=` | Global search results | SSR, `noindex,follow` |
| `/compare?ids=a,b,c` | Compare up to 3 packages | SSR |
| `/package/{slug}/customise` | "Customise this trip" editor | CSR |
| `/checkout/{cartId}/travellers` → `/checkout/{cartId}/payment` → `/checkout/{cartId}/review` | 3-step checkout | SSR shell + CSR |
| `/booking/{reference}/confirmation` | Confirmation | SSR (auth or signed token) |
| `/account` · `/account/profile` · `/account/travellers` · `/account/payments` · `/account/privacy` (DPDP/GDPR export & delete) · `/account/loyalty` · `/account/referrals` | Account | SSR, auth |
| `/trips` · `/trips/{reference}` · `/trips/{reference}/itinerary` · `/trips/{reference}/documents` · `/trips/{reference}/support` | My trips | SSR, auth |
| `/wishlist` | Wishlist (guest = local, merges on login) | SSR, auth optional |
| `/login` · `/signup` · `/verify-otp` · `/forgot-password` | Auth | SSR |

## 3. System

- `/404` (with search + popular destinations), `/500`, `/offline` (PWA)
- `/robots.txt`, `/sitemap.xml` (index) → `/sitemaps/{pages|destinations|packages|activities|stays|blog|images}-{n}.xml` (≤ 50 000 URLs each)
- `/.well-known/apple-app-site-association`, `/.well-known/assetlinks.json` (deep links: `/package/*`, `/activity/*`, `/stay/*`, `/trips/*`, `/deals/*`)
- `/manifest.webmanifest`, `/feed.xml` (blog RSS)

## 4. Admin (`admin.` subdomain, `noindex`, 2FA required)

`/dashboard` · `/content/{pages|navigation|banners|blog|seo|redirects|media}` · `/inventory/{packages|departures|activities|stays|transfers|add-ons|suppliers|pricing|imports}` · `/destinations/{regions|countries|cities}` (incl. travel-advisory toggle) · `/sales/{leads|quotes|follow-ups}` · `/ops/{bookings|vouchers|supplier-confirmations|documents}` · `/finance/{payments|refunds|invoices|reports}` · `/marketing/{coupons|deals|reviews|referrals}` · `/settings/{users|roles|currencies|feature-flags|remote-config|audit-log}`

## 5. Supplier portal (`partners.` subdomain)

`/products` · `/bookings` (confirm / reject within SLA) · `/availability` · `/payouts` · `/profile`

## 6. Mobile app ↔ web route parity (Phase 4)

| App tab | Web equivalent | API |
|---|---|---|
| Home | `/` | `GET /v1/pages/home` |
| Explore | `/asia`, `/search` | `GET /v1/destinations`, `GET /v1/search` |
| Trips | `/trips` | `GET /v1/me/bookings` |
| Wishlist | `/wishlist` | `GET /v1/me/wishlist` |
| Account | `/account` | `GET /v1/me` |
