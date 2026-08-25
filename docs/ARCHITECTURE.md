# Architecture

## 1. Shape of the system

```text
Browser
├── Static pages (portfolio, wallet, gateway) — prerendered per locale
├── Zustand stores
│   ├── wallet          → localStorage    (balance, transactions, resume flag)
│   └── payment intent  → sessionStorage  (the top-up being paid for)
└── Axios → Next.js route handlers
             ├── GET  /api/health
             └── POST /api/payments/authorize   (simulated, stateless)
```

There is no database, no session and no external service. The wallet is the browser's; the
server only decides whether a simulated card authorization succeeds.

## 2. Layering

Every feature under `src/features/` follows the same three layers.

| Layer     | Folder                          | May import                        |
| --------- | ------------------------------- | --------------------------------- |
| Domain    | `features/*/domain/`            | Other domain modules, `lib/`, Zod |
| State     | `features/*/store/`, `*/hooks/` | Domain, React, Zustand            |
| Interface | `features/*/components/`        | State, `components/ui`, `hooks/`  |

The domain layer is the important one. `features/wallet/domain/wallet.ts` is a set of pure
functions over a plain `WalletSnapshot`: it never touches React, storage or the network. That
is what makes the balance arithmetic unit-testable, and it is the seam that a real backend
would slot into — the rules move to the server, the store calls an API instead of a pure
function, and the components do not change.

Direction of dependencies is one-way: interface → state → domain. Nothing in `domain/` knows
that React exists.

## 3. Wallet state

### Data

```ts
interface WalletSnapshot {
  balance: number; // whole Toman, integer
  transactions: Transaction[]; // newest first, capped at 100
  appliedReferences: string[]; // idempotency keys, capped at 200
  resumeUnlocked: boolean;
}
```

Money is an integer number of Toman throughout. There is no sub-unit and no floating-point
arithmetic anywhere in the money path, so rounding error cannot appear.

### Applying a transaction

`applyTransaction(snapshot, input)` returns a discriminated result rather than throwing:

```ts
type WalletResult<T> = { ok: true; value: T } | { ok: false; error: WalletErrorCode };
```

Checks run in a fixed order — amount validity, range (for user-entered amounts only), duplicate
reference, then sufficient funds — and the first failure wins. The function returns a new
snapshot and never mutates its argument, which a unit test asserts directly.

### Idempotency

Every mutation carries a `reference`, and `appliedReferences` records the ones already used.
A repeat with the same reference returns `DUPLICATE_REFERENCE` and changes nothing.

The references are chosen so that this actually protects something:

- A top-up uses the **payment intent id**. If an authorization is somehow submitted twice for
  the same intent, the second credit is rejected.
- A resume purchase is additionally guarded by `resumeUnlocked`, so the price is charged once
  in the wallet's lifetime, plus an in-flight ref in `useResumeDownload` that rejects clicks
  arriving before React has re-rendered.

### Persistence

Zustand's `persist` middleware writes the snapshot to `localStorage` under
`amin-khoddam.wallet` with a version number, and `partialize` keeps the actions out of storage.

Because that data does not exist on the server, components must not read it during the first
client render. `useWalletHydrated()` wraps `persist.hasHydrated()` in `useSyncExternalStore`
with a server snapshot of `false`; every balance-dependent view shows a skeleton until it
flips. This is why the wallet renders without a hydration mismatch even though the page is
statically generated.

## 4. Payment flow

```text
Amount sheet ──creates──▶ payment intent (sessionStorage)
     │                            │
     └──router.push──▶ /wallet/payment
                                  │
                       CardForm ──▶ useAuthorizePayment (TanStack Query mutation)
                                  │        │
                                  │        └──▶ axios ──▶ POST /api/payments/authorize
                                  │                              │
                                  │                     authorizePayment() — pure
                                  ▼
                     approved → wallet.deposit(amount, reference = intent.id)
                              → receipt shown, intent cleared
                     declined → localized reason, form stays usable
```

`authorizePayment` is a pure function taking `{ now, reference }` as context, so the route
handler stays thin and the decision logic is unit-tested without HTTP. Its outcome is
deterministic: one published test card is always approved, another is always declined. Nothing
random, so the demo behaves the same every time and the tests are stable.

The route handler validates the request with the same Zod vocabulary the client uses, and the
client validates the _response_ with `authorizationResultSchema` before acting on it. The
gateway never returns, stores or logs the card number — only a masked form of it.

## 5. Internationalization

`next-intl` with `localePrefix: "always"`. `src/proxy.ts` (the Next.js 16 replacement for
`middleware.ts`) redirects unprefixed paths.

The `[locale]` segment sits **above** the root layout, which makes it a Next.js _root
parameter_. `src/i18n/request.ts` reads it through `next/root-params` instead of the deprecated
`setRequestLocale`, so any server component can resolve the locale without prop drilling and
pages still prerender statically.

Content is split by kind, not by convenience:

- `src/config/profile.ts` holds structure — ids, ordering, technology lists, URLs. Locale-independent.
- `src/i18n/messages/*.json` holds every string a reader sees, keyed by those ids.

A section renders by iterating the config and looking each id up in the catalog. Adding a
project means one config entry and two message entries; no component changes.

Both catalogs must keep an identical key structure. That is a review step, not a lint rule.

## 6. Design system

### Tokens

`src/app/globals.css` defines the palette twice — `:root` for light, `.dark` for dark — and
maps every token into Tailwind through `@theme inline`. Components only ever use semantic
names (`bg-card`, `text-muted-foreground`, `border-border`, `text-brand`), never raw colors, so
both themes stay correct by construction.

Beyond the shadcn set, the project adds `--brand`, `--brand-accent`, `--success`, the glass
surface variables and two elevation shadows.

### Surfaces

`Surface` (`src/components/ui/surface.tsx`) is the single card primitive, with `glass`,
`strong`, `solid` and `subtle` variants. The portfolio and the wallet both use it, which is
what keeps the two halves looking like one product. shadcn's `Card` was removed rather than
kept alongside it — two card systems would have drifted.

The frosted look comes from `.glass-panel` / `.glass-panel-strong`. Their blur is applied with
Tailwind's `backdrop-blur` utilities rather than a hand-written `backdrop-filter`: the CSS
minifier collapses a hand-written pair down to the `-webkit-` prefix alone, which silently
drops the effect in browsers reading the standard property.

### Typography

Persian uses Vazirmatn for both display and body; English uses Sora for headings and Inter for
body. The families are swapped through the `--font-body` / `--font-display` variables under an
`html[lang="fa"]` selector, and the root layout only attaches the variable class of the active
locale so the other family is never requested.

### Motion

`Reveal` is the only entrance animation: a fade and 18 px rise, once, when the element scrolls
into view. Three rules keep it honest:

- It renders the same element on the server and the client. Branching on `useReducedMotion()`
  would change the markup between the two and break hydration, so the preference is applied by
  a `MotionConfig reducedMotion="user"` wrapper instead.
- The viewport trigger is an explicit `useInView` hook driving `animate`, rather than
  `whileInView`. That keeps the component inside the `domAnimation` feature set, so
  `MotionPreferences` can mount `LazyMotion` in `strict` mode and the page loads a smaller
  slice of the library.
- `MotionPreferences` wraps only the portfolio page, so the wallet and gateway routes do not
  load Framer Motion at all.

A `<noscript>` rule forces revealed content visible, so the page still reads without
JavaScript. The trade-off is deliberate and worth naming: the hidden state is present in the
server HTML, so a visitor whose JavaScript loads but fails would see the page shell without its
sections. Crawlers execute JavaScript and the markup is fully present for them.

### Provider placement

Only theming is global. `AppProviders` mounts `next-themes` and nothing else; the query client
lives in `PaymentQueryProvider` on the gateway page, because that is the one route with server
state.

`src/config/site.ts` is deliberately import-free for the same reason: it is reached from client
components, and importing the environment schema there would have pulled the validation
library into every route's bundle. Server code that needs the public origin reads `env`
directly.

Measured effect, gzipped scripts per route: the portfolio carries neither the validation
library nor the query client; the wallet adds the validation library for its amount schema;
the gateway adds the query client and the HTTP client on top.

## 7. Server code

Two route handlers, both `runtime: "nodejs"` and `dynamic: "force-dynamic"`.

`POST /api/payments/authorize` is ordered deliberately: rate limit, then body size, then JSON
parse, then schema, then the (artificially delayed) decision. The cheapest rejection happens
first, and a malformed body never reaches the parser.

The rate limiter (`src/lib/rate-limit.ts`) is a fixed window in process memory that prunes
expired entries once the map grows past a threshold, so a long-running container cannot leak.
It is per-instance; a multi-instance deployment would need a shared store, and the call site
would not change.

`src/lib/logger.ts` emits single-line JSON and takes only scalar metadata. The authorization
handler logs an error name, never a message, a stack or anything the payer typed.

Graceful shutdown is Next.js' own: its standalone server registers `SIGTERM` and `SIGINT`
handlers, so no custom server is needed.

## 8. Dependency decisions

Each library in the brief was adopted only where it earns its place.

| Library         | Used for                                   | Why not something smaller                                                       |
| --------------- | ------------------------------------------ | ------------------------------------------------------------------------------- |
| Zustand         | Wallet and payment intent stores           | Persistence, hydration signalling and atomic selectors, without a provider tree |
| Zod             | Amount, card, request and response schemas | The same vocabulary validates the form, the request body and the response       |
| React Hook Form | Amount and card forms                      | Uncontrolled fields keep per-keystroke validation cheap                         |
| TanStack Query  | The authorization mutation                 | Owns the idle/pending/settled lifecycle that drives the gateway's states        |
| Axios           | Calls to the app's own API                 | One instance carrying base path, timeout and status policy                      |
| Framer Motion   | The single reveal animation                | Viewport triggering and a real reduced-motion mode                              |
| next-intl       | Routing, catalogs, `Intl` formatting       | Root-param locale resolution and static rendering                               |
| next-themes     | Light/System/Dark                          | Pre-paint application without a flash                                           |
| vaul            | Bottom sheets (via shadcn's Drawer)        | Drag-to-dismiss behaviour that matches native sheets                            |

Deliberately absent: any database, ORM, queue, cache, auth library, state-sync layer or
analytics SDK. None of them has a job in this product.

## 9. Known limits

- Wallet data is per-browser. It does not follow the visitor and is lost when site data is cleared.
- The gateway is a simulation. It performs no network, banking or PCI-relevant work.
- The rate limiter is per-instance.
- The resume PDF is generated by a script and committed; it is a placeholder document.
