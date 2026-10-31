# Phase 1 Backlog — Foundation

Window: 8 weeks · 4 two-week sprints (S1–S4) · Target: a deployable production site with home, region and country pages, the hover mega-menu, auth, lead capture and an admin that edits all of it. No checkout yet.

**Phase exit criteria (all required):**
1. `staging` and `production` live behind CloudFront and deployed from `main` by CI. Every PR gets a preview URL.
2. Home (14 blocks), `/asia`, 6 region pages and ≥ 12 launch-priority country pages are live with real copy and licensed HD images.
3. Lighthouse mobile on home/region/country: Perf ≥ 90, SEO 100, A11y ≥ 95, BP ≥ 95. CWV lab: LCP < 2.0 s, CLS < 0.05.
4. Mega-menu passes keyboard + screen-reader audit (NVDA + VoiceOver) and Playwright hover/keyboard specs.
5. Marketing can edit the nav, reorder or hide home blocks, swap a hero image from Unsplash/Pexels and publish without a deploy (verified by a non-engineer).
6. Auth works on web via email/password, OTP (SMS + WhatsApp), Google and Apple, and the same endpoints are exercised by a headless API test standing in for the mobile app.
7. The `/v1` OpenAPI spec is published, the generated `api-client` is used by web and admin, and no web page reads the database directly.

Estimates are in story points (1 pt ≈ ½ ideal day). **P0** = must ship for exit · **P1** = should ship · **P2** = stretch.

---

## E1 · Monorepo & engineering platform — Platform & DevOps

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E1-1 | Turborepo + pnpm workspaces scaffold (`apps/web`, `apps/admin`, `apps/api`, `packages/{ui,tokens,api-client,validation,config}`) | `pnpm i && pnpm build` green from clean clone. Shared ESLint/TS strict/Prettier config. Turbo remote cache on | 5 | P0 | S1 |
| E1-2 | CI pipeline (GitHub Actions) | On every PR: lint, typecheck, unit, build, Playwright smoke, Lighthouse CI (budgets enforced), bundle-size check (`size-limit`), OpenAPI lint, Prisma migrate diff. Required checks block merge | 8 | P0 | S1 |
| E1-3 | Trunk-based workflow | Protected `main`, 2 approvals, conventional commits (commitlint), CODEOWNERS per squad, Renovate | 2 | P0 | S1 |
| E1-4 | Terraform: AWS baseline | VPC, RDS Postgres 16 (Multi-AZ, encrypted, PITR), ElastiCache Redis, S3 (media + backups), ECS Fargate (api, admin), CloudFront, ACM, Route 53, Secrets Manager, KMS. Separate `staging`/`prod` workspaces | 13 | P0 | S1–S2 |
| E1-5 | Web hosting decision + deploy | Web on Vercel **or** ECS + CloudFront (decision D3). Preview deploy per PR with seeded staging API | 5 | P0 | S2 |
| E1-6 | Observability | OpenTelemetry traces api→db/redis, Sentry (web, admin, api) with release tracking, Grafana/Datadog dashboards for p95 latency and error rate, uptime checks + PagerDuty | 8 | P0 | S2–S3 |
| E1-7 | Security baseline | HSTS, CSP (nonce-based), security headers test in CI, WAF rules on CloudFront, dependency + container scanning, secret scanning | 5 | P0 | S2 |
| E1-8 | Backups & restore drill | Daily snapshots + PITR. A documented restore into a scratch env passes before phase exit | 3 | P0 | S4 |
| E1-9 | Storybook + visual regression | Storybook deployed per PR. Chromatic/Playwright screenshots on `packages/ui` | 3 | P1 | S2 |

## E2 · Design system & tokens — Product & Design + Web

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E2-1 | Token build pipeline | `packages/tokens/src/tokens.json` → Style Dictionary emits `tokens.css`, Tailwind preset, RN JSON. CI fails if generated files drift | 3 | P0 | S1 |
| E2-2 | Contrast guard | Unit test asserts every declared text/background pair ≥ 4.5:1 (≥ 3:1 for non-text). Accent CTA sign-off (decision D2) | 2 | P0 | S1 |
| E2-3 | Figma library mirrors tokens | Variables in Figma match JSON 1:1. Token-sync plugin documented | 5 | P0 | S1 |
| E2-4 | Fonts | Playfair Display + Plus Jakarta Sans self-hosted via `next/font`, subset Latin (+ Devanagari/Arabic later), `font-display: swap`, size-adjusted fallbacks (CLS 0) | 2 | P0 | S1 |
| E2-5 | Primitives (`packages/ui`) | Button (pill, CTA/secondary/ghost), IconButton, Link, Badge (New/Hot/Trending/Best seller), Chip, Rating, Price (strike + discount pill), Input, Select, DateMonthPicker, TravellerPicker, Accordion, Tabs, Dialog, Drawer, Toast, Skeleton, Carousel (scroll-snap, arrows, a11y), ImageWithCredit. Each has a Storybook story, a11y test (axe) and keyboard spec | 21 | P0 | S1–S3 |
| E2-6 | Cards | PackageCard (image slider, duration chip, route, inclusion icons, rating, price, heart), DestinationCard (portrait), RegionTile, ActivityCard, BlogCard, ReviewCard | 13 | P0 | S2–S3 |
| E2-7 | Icon set | Inclusion, theme and utility icons as tree-shaken SVG components with a shared RN export | 3 | P0 | S2 |
| E2-8 | Placeholder wordmark | Playfair wordmark in `--brand-primary` as SVG + favicon set. Real logo is a post-build task | 1 | P0 | S1 |

## E3 · API core (NestJS) — Catalogue & Search + Platform

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E3-1 | NestJS app skeleton | `/v1` prefix, Zod validation pipe (shared schemas), RFC 9457 errors, request id, OTel, health/readiness, graceful shutdown, Dockerfile < 200 MB | 5 | P0 | S1 |
| E3-2 | Prisma schema v1 + migrations | `schema.prisma` migrated. Raw-SQL migration adds GalleryItem single-owner CHECK and trigram indexes on names. Seed script loads 6 regions, launch countries/cities, themes | 5 | P0 | S1 |
| E3-3 | OpenAPI as contract | Spec generated from Nest decorators and diffed against `openapi.yaml` in CI. `packages/api-client` generated (openapi-typescript + typed fetch) and published to workspace | 5 | P0 | S1–S2 |
| E3-4 | Caching layer | Redis read-through for public GETs, tag-based invalidation on admin publish, `Cache-Control` + `Surrogate-Key` headers, CloudFront purge on publish | 5 | P0 | S2 |
| E3-5 | Rate limiting + bot protection | Redis sliding window per IP+route. Turnstile/reCAPTCHA verification on auth, OTP and leads | 3 | P0 | S2 |
| E3-6 | Content endpoints | `GET /navigation/{key}`, `/pages/{slug}` (with preview token), `/banners`, `/redirects/resolve`, `/config` | 5 | P0 | S2 |
| E3-7 | Destination endpoints | `/regions`, `/regions/{slug}`, `/countries/{slug}`, `/cities/{slug}`, `/destinations/trending`, `/destinations/seasonal`, `/themes`. Advisory-blocked countries excluded everywhere (test-covered) | 8 | P0 | S2 |
| E3-8 | Package listing (read-only, for home and country blocks) | `GET /packages` supports country/region/theme/flag/sort and cursor pagination. Full filters arrive in Phase 2 | 5 | P0 | S3 |
| E3-9 | Search suggest | Meilisearch index for destinations + packages (sync via BullMQ on publish). `/search/suggest` p95 < 80 ms, typo-tolerant ("thialand" → Thailand) | 8 | P0 | S3 |
| E3-10 | Reviews read | `/reviews?featured=true`, `/reviews/summary` (seeded with imported Google reviews, labelled by source) | 2 | P1 | S3 |
| E3-11 | Contract tests for mobile | Supertest suite drives every Phase 1 endpoint exactly as the RN client would (bearer only, no cookies). Coverage ≥ 80% on services | 5 | P0 | S3–S4 |

## E4 · Auth & privacy — Platform + Booking & Payments

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E4-1 | Email + password | Argon2id, register/login/forgot/reset, email verification (Resend/SES), lockout after 5 failures | 5 | P0 | S2 |
| E4-2 | JWT + rotating refresh | 15 min access token, 30 day refresh with family reuse detection, logout revokes family. Web BFF keeps the refresh token in an httpOnly SameSite=Lax cookie | 5 | P0 | S2 |
| E4-3 | OTP via SMS + WhatsApp | 6-digit code, 5 min TTL in Redis, 3 attempts, per-phone and per-IP limits, provider abstraction (MSG91/Twilio + WhatsApp Cloud API) | 8 | P0 | S2–S3 |
| E4-4 | Google + Apple sign-in | ID-token exchange endpoint usable from web and native SDKs. Account linking by verified email | 5 | P0 | S3 |
| E4-5 | RBAC + 2FA for staff | Roles from schema. Guards per admin route. TOTP mandatory for every non-customer role. Every admin write emits an AuditLog row (interceptor) | 8 | P0 | S2–S3 |
| E4-6 | Consent + DPDP/GDPR | Cookie/consent banner (analytics off until consent), consent ledger, `/me/data-requests` export (JSON zip) and erasure (anonymise) jobs | 5 | P0 | S3–S4 |
| E4-7 | PII encryption helpers | KMS-backed envelope encryption util + keyed hash for phone lookup. Lint rule bans logging `*Enc` fields | 3 | P0 | S2 |

## E5 · Header & hover mega-menu — Web Experience

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E5-1 | Utility strip | 32 px, `--surface-warm`, 24×7 phone (`tel:`), WhatsApp (`wa.me`), offices link, currency switcher (INR/USD/AED/SGD/EUR/GBP, persisted, display-only in P1), language switcher (EN; HI/AR disabled with "soon"), Login/Sign up | 3 | P0 | S2 |
| E5-2 | Main bar | 72 px. Logo left, 7 nav items centre, search/wishlist/"Plan my trip" CTA right. Nav items are boxless in every state (snapshot test asserts no background or border) | 3 | P0 | S2 |
| E5-3 | Hover intent + panel engine | Opens on `pointerenter` after 120 ms. Closes 250 ms after leaving trigger+panel. Diagonal "safe triangle" keeps it open. Instant swap between items with 150 ms fade/8 px slide. `pointerType==='touch'` uses tap. `prefers-reduced-motion` disables motion. Playwright specs for each timing | 8 | P0 | S2 |
| E5-4 | Item styling | Hover/open: text `--brand-primary`, 2 px underline grows from centre, chevron rotates 180°. Visible focus ring | 2 | P0 | S2 |
| E5-5 | Keyboard + ARIA | Tab through items. Enter/Space/ArrowDown opens and focuses first link. Arrow keys move within columns. Esc closes and restores focus. `aria-expanded`, `aria-controls` and roles correct. axe clean. Manual NVDA + VoiceOver pass | 5 | P0 | S3 |
| E5-6 | Panel layouts from CMS | 3 link columns + promo (card / carousel / countdown) rendered from `/v1/navigation/header`. Links show flag/icon, New/Hot badge, "from ₹" on hover. Max 1200 px, 16 px radius, 32 px padding | 5 | P0 | S3 |
| E5-7 | Transparent → solid header | On home, header is transparent with white text over the hero, then solid white + shadow + 64 px after 80 px scroll. IntersectionObserver, no scroll listeners, no CLS | 3 | P0 | S3 |
| E5-8 | Mobile drawer + bottom tab bar | Below 1024 px: full-screen drawer with accordions (same data), bottom tab bar (Home, Explore, Trips, Wishlist, Account), focus trap, body scroll lock | 5 | P0 | S3 |
| E5-9 | Search overlay | Search icon opens the overlay with `/search/suggest` autocomplete, recent searches and popular destinations | 3 | P1 | S3 |
| E5-10 | Footer | 5 columns from `/navigation/footer`: contact, social, licences (IATA/TAAI/MoT placeholders), payment icons, app badges ("coming soon") | 3 | P0 | S3 |

## E6 · Home page (14 CMS blocks) — Web Experience + SEO & Content

Each block = Zod schema in `packages/validation/blocks` + RSC component + Storybook story + admin form + responsive 360→1920 px check.

| ID | Block | Key acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E6-1 | Block renderer | Ordered, hide/show, unknown block types skipped safely, preview mode via draft token, ISR revalidated by publish webhook | 3 | P0 | S2 |
| E6-2 | Hero | Rotating 5 destinations (image or muted 10 s loop video; image-only on Save-Data or slow connections). First image is the LCP: `priority`, AVIF, < 200 KB. Gradient legibility. Search bar with 3 tabs (Tours & Packages, Things To Do, Stays), destination autocomplete, month, travellers. Trust strip | 8 | P0 | S3 |
| E6-3 | Explore by region | 6 tiles | 2 | P0 | S3 |
| E6-4 | Trending destinations | Scroll-snap carousel of portrait cards with "from ₹" and package count | 3 | P0 | S3 |
| E6-5 | Best-selling packages | PackageCard grid from `/packages?flag=best_seller` | 3 | P0 | S3 |
| E6-6 | Travel by theme | 9 chips/tiles | 2 | P0 | S3 |
| E6-7 | Deals banner | Countdown from Banner.countdownTo, SSR-safe (no hydration mismatch) | 2 | P0 | S3 |
| E6-8 | Things to do | Activity cards (seeded in P1, bookable in P2) with instant-confirmation and free-cancellation badges | 3 | P1 | S4 |
| E6-9 | Why book with us | 4–6 value props, CMS-editable | 1 | P0 | S3 |
| E6-10 | Plan my trip | Split block, 3-step form → `POST /leads` (type PLAN_MY_TRIP). Validation, consent checkbox, success state, CRM notification. AI draft arrives in Phase 3 | 5 | P0 | S3 |
| E6-11 | Seasonal picks | "Where to go in {current month}" from `/destinations/seasonal` | 2 | P0 | S3 |
| E6-12 | Reviews | Aggregate + cards + source badges. Imported reviews labelled honestly by source | 3 | P1 | S4 |
| E6-13 | Travel stories | 3 latest posts. Before the Phase 3 blog this block renders editor-picked guide links or is hidden | 1 | P2 | S4 |
| E6-14 | Partners & press | Logo strip (grayscale → colour on hover) | 1 | P1 | S4 |
| E6-15 | Newsletter + app download | `POST /newsletter` with double opt-in. Store badges show "Coming soon" | 2 | P0 | S4 |

## E7 · Region & country pages — Web Experience + SEO & Content

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E7-1 | `/asia` hub | Region tiles + country index (A–Z), ItemList JSON-LD | 2 | P0 | S3 |
| E7-2 | Region template | Hero, intro, country grid, featured packages, seasonal strip, FAQs, internal links to nearby regions | 5 | P0 | S3 |
| E7-3 | Country template | Hero, overview, quick facts, best time (12-month bar), top cities, packages, activities teaser, visa info, FAQs, guides, gallery, breadcrumbs | 8 | P0 | S3–S4 |
| E7-4 | City template (basic) | Overview, packages, "things to do" teaser. Full listing arrives in Phase 2 | 3 | P1 | S4 |
| E7-5 | Advisory handling | Countries with `advisoryActive && !saleEnabled` return 404 to public routes (or an informational page, decision D6) and disappear from menus, search and sitemaps | 2 | P0 | S3 |
| E7-6 | Launch content | Unique copy (≥ 600 words, no AI boilerplate, fact-checked) for 6 regions and the 12 launch countries: Thailand, Indonesia (Bali), Vietnam, Japan, South Korea, Maldives, UAE, Singapore, Nepal, Bhutan, Sri Lanka, Uzbekistan (+ Turkey/Georgia if capacity allows) | 13 | P0 | S2–S4 |

## E8 · SEO foundation — SEO & Content

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E8-1 | Metadata templates | Title/description templates per page type with CMS override, canonical, OG/Twitter cards (dynamic OG image via `@vercel/og` or Satori) | 3 | P0 | S3 |
| E8-2 | JSON-LD helpers | Typed builders: Organization, WebSite+SearchAction, BreadcrumbList, TouristDestination, ItemList, FAQPage. Validated in CI against schema.org | 3 | P0 | S3 |
| E8-3 | Sitemaps | Sitemap index, page/destination/image sitemaps, regenerated on publish | 3 | P0 | S4 |
| E8-4 | Redirect middleware | Next middleware resolves CMS redirects (edge-cached). Slug changes auto-create 301s | 2 | P0 | S3 |
| E8-5 | robots, 404, 500 | 404 with search + popular destinations. Staging and previews are `noindex` | 1 | P0 | S3 |
| E8-6 | Analytics baseline | GA4 + GTM gated by consent, server-side event endpoint stub, core events (`view_item_list`, `search`, `generate_lead`, `menu_open`) | 3 | P1 | S4 |

## E9 · Imagery pipeline — SEO & Content + Admin & CRM

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E9-1 | Stock search proxy | `/admin/media/stock-search` across Unsplash + Pexels, keys server-side, results show licence + photographer | 3 | P0 | S2 |
| E9-2 | Import to S3 | Download original (min 2400 px for heroes, 1600 px for cards, enforced), semantic filename, store credit/licence/sourceId, generate blurDataURL + dominant colour, trigger Unsplash download-tracking endpoint (API terms) | 5 | P0 | S2 |
| E9-3 | Image CDN loader | Next/Image custom loader → CloudFront image handler (or Cloudinary/imgix, decision D4): AVIF/WebP, srcset, focal-point crops, lazy below the fold | 5 | P0 | S2 |
| E9-4 | Alt-text gate | Publish blocked without alt text. Lint warns on generic alt ("image", "photo") | 1 | P0 | S2 |
| E9-5 | Seed run | Script runs the 12 destination seed queries from the brief. Editors curate ≥ 5 heroes + ≥ 30 card images. Credits visible on hover/caption | 3 | P0 | S3 |

## E10 · Admin panel v1 — Admin & CRM

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E10-1 | Admin shell | Next.js app on `admin.` subdomain, login + mandatory TOTP, role-aware sidebar, `noindex` | 5 | P0 | S2 |
| E10-2 | Navigation editor | Tree editor for items → columns → links (badge, icon/flag, price) + promo config. Live preview of the mega-menu. Publish purges cache | 8 | P0 | S3 |
| E10-3 | Page/block editor | Reorder (drag + keyboard), hide/show, per-block form generated from Zod schema, draft/preview/publish/schedule, revision history + restore | 13 | P0 | S3–S4 |
| E10-4 | Destinations CRUD | Regions/countries/cities incl. best months, visa, FAQs, gallery, SEO fields, advisory + sale toggle (SUPER_ADMIN only, audited) | 8 | P0 | S3 |
| E10-5 | Media library | Grid, search by tag, stock picker (E9), upload, focal-point editor, usage list ("where is this used") | 5 | P0 | S3 |
| E10-6 | Packages CRUD (basic) | Enough to seed home + country blocks: core fields, route, themes, hero/gallery, from-price, flags. Departures/pricing editor arrives in Phase 2 | 8 | P0 | S3–S4 |
| E10-7 | Leads inbox | List + detail, status pipeline (New → Contacted → Quoted → Won/Lost), assignee, notes, WhatsApp click-to-chat, email alert to Sales on new lead | 5 | P0 | S4 |
| E10-8 | Banners & redirects | CRUD with schedule windows | 3 | P1 | S4 |
| E10-9 | Users, roles, audit log viewer | Invite staff, assign roles, filterable audit log | 3 | P0 | S4 |

## E11 · QA & release — QA Automation

| ID | Story | Acceptance criteria | Pts | Pri | Sprint |
|---|---|---|---|---|---|
| E11-1 | Test strategy doc | Pyramid, ownership, flaky-test policy, device/browser matrix (Chrome, Safari iOS 16+, Firefox, Samsung Internet) | 2 | P0 | S1 |
| E11-2 | Playwright suites | Mega-menu (hover timing, keyboard, touch), home search → listing URL, lead submit, login (all 4 methods mocked), admin publish → site updates | 8 | P0 | S2–S4 |
| E11-3 | Performance budgets | Lighthouse CI budgets + WebPageTest on 4G Moto G profile for home/country. JS per route ≤ 170 KB gz | 3 | P0 | S3 |
| E11-4 | Accessibility audit | axe in CI + manual WCAG 2.2 AA audit of header, home, country and auth before exit | 5 | P0 | S4 |
| E11-5 | Load test | k6: 500 RPS on public reads, p95 < 300 ms with warm cache | 3 | P1 | S4 |

---

## Sprint plan

| Sprint | Goal | Demo |
|---|---|---|
| **S1** (wk 1–2) | Skeleton everything | Clean clone builds. CI green. Tokens in Storybook. API `/health` on staging. DB migrated + seeded. Figma library |
| **S2** (wk 3–4) | Contracts and plumbing | Auth (email + JWT) end-to-end. Content and destination APIs live. Header + hover mega-menu with seeded data. Image import from Unsplash. Admin shell |
| **S3** (wk 5–6) | Pages | Home with ≥ 11 blocks. Region + country templates. Nav/page/destination editors. OTP + Google/Apple. Search suggest |
| **S4** (wk 7–8) | Harden and launch | All 14 blocks. Launch content. Leads inbox. DPDP flows. Sitemaps. Perf/a11y audits. Restore drill. Production launch |

## Critical path & dependencies

1. **Tokens (E2-1) → UI primitives (E2-5) → header/home.** Tokens are frozen at the end of S1, and changes after that need a design review.
2. **OpenAPI + Prisma (E3-2/3) → api-client → every web/admin story.** Web starts S2 on MSW mocks generated from the spec, so it never waits on the API.
3. **Image pipeline (E9-1..3) → hero LCP target.** If decision D4 slips past S2, the hero can't hit its < 200 KB LCP budget.
4. **Content writing (E7-6)** starts S2 and is the most common launch blocker. SEO & Content owns it with a weekly burndown.
5. **Third-party accounts (needed before S2):** AWS org, domain + DNS, Unsplash/Pexels production API keys, Google/Apple sign-in, Meta WhatsApp Business verification (takes 1–3 weeks, so start on day 1), SMS DLT registration (India, 1–2 weeks), Resend/SES domain verification.

## Phase 1 totals

91 stories, 422 pts across 11 epics. These are epic-level estimates: expect them to grow when squads split them into tasks at S1 planning. Re-baseline after S1 velocity is known. Phase 1 is sized so that squads with no Phase 1 stories (mostly Mobile and Data & AI) can start Phase 2–4 spikes in parallel: RN shell on the generated api-client, payments sandbox, search relevance.
