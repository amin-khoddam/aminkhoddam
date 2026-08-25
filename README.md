# Amin Khoddam — Portfolio & Wallet Demo

A personal portfolio for a frontend developer, with a focused fintech-style wallet built into
the same product. The portfolio presents the profile; the wallet demonstrates state management,
form validation, financial flows and production-oriented frontend architecture.

> All personal details (name, contact information, companies, projects) are **placeholders**.
> See [Replacing the placeholder content](#replacing-the-placeholder-content).

---

## Features

**Portfolio**

- Hero, about, skills, experience, projects and contact sections on one page
- Persian and English content with full RTL and LTR layouts
- Light / System / Dark themes, defaulting to System and persisted in local storage
- Subtle scroll-triggered entrance animations that respect `prefers-reduced-motion`

**Wallet**

- Balance, top-up, withdrawal and transaction history, persisted in local storage
- Amount validation on every keystroke, between 50,000 and 10,000,000 Toman
- Bottom sheets for the top-up and withdrawal flows
- A simulated bank payment gateway with card validation and success/decline states
- A paid resume download: 10,000 Toman once, free afterwards

---

## Technology

| Area         | Choice                                                  |
| ------------ | ------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, React 19, Server Components)    |
| Language     | TypeScript (strict)                                     |
| Styling      | Tailwind CSS v4, shadcn/ui, Lucide icons                |
| Animation    | Framer Motion                                           |
| Theming      | next-themes                                             |
| i18n         | next-intl (`fa` default, `en`), locale-prefixed routes  |
| Client state | Zustand with local/session storage persistence          |
| Server state | TanStack Query (the payment authorization mutation)     |
| HTTP         | Axios instance for the app's own API routes             |
| Forms        | React Hook Form with Zod schemas                        |
| Tests        | Vitest                                                  |
| Delivery     | Docker (multi-stage, standalone output), GitHub Actions |

There is **no database and no external backend**. The only server code is two Next.js route
handlers: a health probe and the simulated payment authorization. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for why each dependency is present.

---

## Getting started

Requirements: Node.js 20.9 or newer.

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

The app is served at http://localhost:3000 and redirects to `/fa`. English is at `/en`.

### Scripts

| Script                    | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Development server                       |
| `npm run build`           | Production build                         |
| `npm start`               | Serve the production build               |
| `npm run lint`            | ESLint                                   |
| `npm run typecheck`       | Route typegen followed by `tsc --noEmit` |
| `npm test`                | Vitest, single run                       |
| `npm run test:watch`      | Vitest in watch mode                     |
| `npm run test:coverage`   | Vitest with a V8 coverage report         |
| `npm run format`          | Prettier write                           |
| `npm run format:check`    | Prettier check (also runs in CI)         |
| `npm run resume:generate` | Regenerate the placeholder resume PDF    |

---

## Trying the wallet

1. Open **Wallet** from the header.
2. **Add balance** → enter an amount between 50,000 and 10,000,000 → **Continue to payment**.
3. On the gateway, use a test card:

   | Card                  | Result   |
   | --------------------- | -------- |
   | `4242 4242 4242 4242` | Approved |
   | `5555 5555 5555 4444` | Declined |

   Any expiry in the future and any 3–4 digit CVV2 works. Both cards are printed on the page
   and fill the form when clicked.

4. After an approved payment the balance updates and a transaction appears.
5. **Download resume** (header, hero or contact) charges 10,000 Toman once and then downloads.

Wallet state lives in `localStorage` under `amin-khoddam.wallet`. Use **Reset wallet** in the
transaction panel to clear it.

---

## Project structure

```text
src/
├── app/                        Routes, layouts and route handlers
│   ├── [locale]/               Localized route tree (this is the root layout)
│   │   ├── wallet/             Wallet page and the payment gateway page
│   │   ├── layout.tsx          <html>, providers, header and footer
│   │   ├── page.tsx            Portfolio page
│   │   ├── error.tsx           Localized error boundary
│   │   └── not-found.tsx       Localized 404
│   ├── api/                    health probe, payment authorization
│   ├── globals.css             Design tokens and shared surface classes
│   └── providers.tsx           Theme and query providers
├── components/
│   ├── layout/                 Header, footer, navigation, theme and locale controls
│   ├── shared/                 Cross-feature presentation pieces
│   └── ui/                     shadcn/ui primitives (owned, edited in place)
├── config/                     Environment contract, site and profile data
├── features/
│   ├── portfolio/components/   Portfolio sections
│   ├── payment/                Gateway domain, store, hook and components
│   └── wallet/                 Wallet domain, store, hooks and components
├── hooks/                      Cross-feature React hooks
├── i18n/                       Routing, request config, navigation, message catalogs
├── lib/                        Framework-agnostic helpers
└── proxy.ts                    Locale routing (Next.js 16 proxy convention)
```

Each feature keeps a `domain/` folder of pure, framework-free logic; React and storage live
outside it. That separation is what makes the wallet rules testable and replaceable.

---

## Replacing the placeholder content

| What                                                     | Where                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| Email, phone, social links, resume file name             | [`src/config/profile.ts`](src/config/profile.ts)             |
| Skills, experience entries, projects (ids, stacks, URLs) | [`src/config/profile.ts`](src/config/profile.ts)             |
| Every visible string, in both languages                  | [`src/i18n/messages/`](src/i18n/messages)                    |
| Resume PDF                                               | `public/resume/` (or edit `scripts/generate-resume-pdf.mjs`) |
| Site origin used in metadata and the sitemap             | `NEXT_PUBLIC_SITE_URL`                                       |

Structural data (ids, links, technology lists) lives in `profile.ts`; anything a reader sees
lives in the message catalogs, keyed by those ids. Both catalogs must keep the same key
structure — English and Persian are checked against each other during review.

---

## Environment

Only one variable matters, and it has a safe default:

| Variable               | Required | Default                 | Purpose                                  |
| ---------------------- | -------- | ----------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | `http://localhost:3000` | Canonical URLs, sitemap, social metadata |
| `PORT`                 | No       | `3000`                  | Port the production server listens on    |

Values are validated at startup by [`src/config/env.ts`](src/config/env.ts); an invalid URL
fails the build instead of producing broken metadata. There are no secrets in this project —
the wallet is client-side and the gateway is simulated.

---

## Docker

```bash
docker compose up --build
```

The image is a three-stage build producing a Next.js standalone server on `node:22-alpine`,
running as the non-root `node` user with a health check against `/api/health`. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## Documentation

| Document                                     | Contents                                                 |
| -------------------------------------------- | -------------------------------------------------------- |
| [docs/PRD.md](docs/PRD.md)                   | Product goals, scope and the flows that were built       |
| [docs/SRS.md](docs/SRS.md)                   | Functional and non-functional requirements               |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Structure, state, i18n, design system, API, decisions    |
| [docs/TESTING.md](docs/TESTING.md)           | What is tested automatically and what is checked by hand |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)     | Build, container, CI and production configuration        |

---

## License

No license is declared. Ask before reusing the code or the design.
