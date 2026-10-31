# AsiaVoyage (working title)

Premium, API-first booking portal for tours, packages, activities, transfers and stays across Asia. Flights are never sold on their own.

## Pre-build deliverables (v0.1, 2026-10-29)

| # | Deliverable | File | Status |
|---|---|---|---|
| a | Sitemap & URL contract | [docs/sitemap.md](docs/sitemap.md) | Draft |
| b | Design tokens (source of truth) | [packages/tokens/src/tokens.json](packages/tokens/src/tokens.json) → [tokens.css](packages/tokens/src/tokens.css), [tailwind-preset.ts](packages/tokens/src/tailwind-preset.ts) | Draft. Contrast verified |
| c | OpenAPI 3.1 outline | [apps/api/openapi/openapi.yaml](apps/api/openapi/openapi.yaml) | Passes `redocly lint` structurally |
| d | Prisma schema | [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma) + [prisma.config.ts](apps/api/prisma.config.ts) | Passes `prisma validate` (Prisma 7.10) |
| e | Phase 1 backlog | [docs/backlog-phase-1.md](docs/backlog-phase-1.md) | Draft, 91 stories / 422 pts |

## Decisions needed before Sprint 1 closes

| ID | Decision | Recommendation |
|---|---|---|
| D1 | **CMS: Payload/Strapi vs. CMS-in-our-API.** The brief lists Page, NavigationMenu, Banner, BlogPost and Media as core Postgres entities, and also lists Payload or Strapi. A separate headless CMS would add a second schema, a second auth/RBAC system and a second audit log, and the mobile apps would still need `/v1` proxies for its content. | Keep content in our Postgres/Prisma, edited from `apps/admin` with Zod-typed blocks. The schema is written this way. If you want Payload, it can own only Page/Blog/Media, with `/v1` proxying it. |
| D2 | **CTA colour.** White text on Saffron `#F26B3A` is 3.03:1, which fails WCAG AA (needs 4.5:1). `#D9562A` hover is also 3.95:1. | CTA fill = `--brand-accent-700 #C4471B` (white label 4.92:1), hover `#A93C17`. `#F26B3A` stays the brand colour for decorative fills, icons and ≥ 24 px text. Alternative: keep `#F26B3A` with a dark `#111827` label (5.86:1). |
| D3 | Web hosting: Vercel vs. ECS + CloudFront | Vercel for web (best ISR/preview DX), AWS for API/admin/data. |
| D4 | Image CDN: Cloudinary vs. imgix vs. self-hosted CloudFront image handler | Cloudinary to start (fastest to the LCP budget), behind a loader interface so it can be swapped later. |
| D5 | Search: Meilisearch (self-host) vs. Algolia | Meilisearch on ECS. Moves to Algolia only if multilingual relevance needs it. |
| D6 | Advisory countries: 404 vs. informational "not currently bookable" page | Informational page with `noindex`. This keeps backlinks and avoids soft-404 churn. |
| D7 | Brand name and domain | Needed by S2 for OAuth clients, WhatsApp Business, SMS DLT and email domain verification. |

## Other notes on the brief

- **Text tokens.** `--ink-400 #9CA3AF` (captions, strikethrough prices) is 2.54:1 and `--success #16A34A` text is 3.30:1. Both fail AA for text, so I added `--ink-500 #6B7280` and `--success-text #15803D` for text uses. The brief's hexes are kept for decorative and non-text uses.
- **Country count.** The region table lists 50 entries, not 48 (it counts Hong Kong and Macau separately and includes Cyprus). This has no effect on the build because destinations are data.
- **Flights.** Flights exist only as `AddOnKind.FLIGHT` on a package booking item (`parentItemId`). The API rejects them in any other context.
- **Stack versions.** Pin the current stable Next.js/NestJS/Expo versions when scaffolding. Prisma 7 moves the DB URL into `prisma.config.ts`, which is already done here.

## Running the web preview

```bash
corepack pnpm install
corepack pnpm dev        # http://localhost:3000
```

What exists so far (Phase 1 web slice, sample data in `apps/web/lib/content.ts` shaped like the `/v1` API):

- Header with utility strip, hover-intent mega-menus (120 ms open / 250 ms close, instant swap, full keyboard support), transparent-to-solid on scroll, and a mobile drawer with a bottom tab bar.
- Home page with all 14 blocks, plus `/tour-packages` (search and theme filter) and `/credits`.
- Photos are openly licensed Wikimedia Commons images stored in `apps/web/public/images`, credited at `/credits`, until the Unsplash/Pexels pipeline (E9) lands.
- Not wired yet: API, auth, real search, and lead submission. The forms show a success state only.
