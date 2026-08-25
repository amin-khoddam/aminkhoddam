# Software Requirements — Portfolio & Wallet Demo

Describes the system as built. Every requirement below corresponds to code in this repository.

## 1. System overview

A Next.js 16 application using the App Router. Pages are React Server Components by default;
interactivity is opted into per component. The portfolio and both wallet pages are statically
generated per locale. Two route handlers provide the only server behaviour: a health probe and
a simulated card authorization. There is no database.

Text direction, fonts and message catalog follow from the `[locale]` route segment, which is a
Next.js root parameter and therefore readable anywhere in the server tree.

## 2. Functional requirements

### 2.1 Localization

| ID     | Requirement                                                                           |
| ------ | ------------------------------------------------------------------------------------- |
| FR-1.1 | Supported locales are `fa` (default) and `en`, defined once in `src/i18n/routing.ts`. |
| FR-1.2 | Every route is locale-prefixed. `/` redirects to `/fa` via `src/proxy.ts`.            |
| FR-1.3 | `fa` renders `dir="rtl"`, `en` renders `dir="ltr"`, both set on `<html>`.             |
| FR-1.4 | The locale switcher preserves the current path and only changes the prefix.           |
| FR-1.5 | All user-facing text comes from `src/i18n/messages/{fa,en}.json`.                     |
| FR-1.6 | Amounts and dates are formatted with the active locale's `Intl` conventions.          |
| FR-1.7 | `fa` loads Vazirmatn; `en` loads Inter and Sora. Only the active family is requested. |

### 2.2 Theming

| ID     | Requirement                                                                  |
| ------ | ---------------------------------------------------------------------------- |
| FR-2.1 | Light, System and Dark are offered; System is the default.                   |
| FR-2.2 | The choice persists in `localStorage` under `amin-khoddam.theme`.            |
| FR-2.3 | The theme is applied before first paint, with no flash of the wrong theme.   |
| FR-2.4 | The selector is reachable from the header on desktop and the menu on mobile. |

### 2.3 Portfolio

| ID     | Requirement                                                                              |
| ------ | ---------------------------------------------------------------------------------------- |
| FR-3.1 | Sections rendered in order: hero, about, skills, experience, projects, contact.          |
| FR-3.2 | Header navigation links to each section and highlights the one in view.                  |
| FR-3.3 | The hero states the name, the role, a short introduction, the main stack and two CTAs.   |
| FR-3.4 | The hero's visual element is a live view of the wallet, not a static mockup.             |
| FR-3.5 | Experience shows three roles covering about three years, each with dated highlights.     |
| FR-3.6 | Projects show name, description, role, technologies and any relevant links.              |
| FR-3.7 | Contact shows email, phone, location and availability, and states they are placeholders. |

### 2.4 Wallet

| ID      | Requirement                                                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------- |
| FR-4.1  | The balance starts at 0 Toman.                                                                                       |
| FR-4.2  | Balance, transactions, applied references and the resume flag persist in `localStorage` under `amin-khoddam.wallet`. |
| FR-4.3  | Amounts are whole Toman held as integers. No floating-point arithmetic is used.                                      |
| FR-4.4  | Top-ups and withdrawals must be between 50,000 and 10,000,000 Toman inclusive.                                       |
| FR-4.5  | Validation runs on every keystroke; submission is blocked while the value is invalid.                                |
| FR-4.6  | A withdrawal above the balance is rejected with a message naming the withdrawable maximum.                           |
| FR-4.7  | Transaction types are `topup`, `withdrawal` and `resume_purchase`, newest first.                                     |
| FR-4.8  | Each transaction carries a unique reference; a reference is applied at most once.                                    |
| FR-4.9  | Stored history is capped at 100 transactions and 200 references.                                                     |
| FR-4.10 | A reset action clears the wallet after an explicit confirmation.                                                     |

### 2.5 Payment gateway

| ID     | Requirement                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-5.1 | A top-up creates a payment intent in `sessionStorage`, carrying id, amount and time.                                                                |
| FR-5.2 | The gateway page reads the intent; without one it explains that and links back.                                                                     |
| FR-5.3 | The card form validates a 16-digit Luhn-valid number, a month of 01–12, a two-digit year that is not in the past, and a 3–4 digit CVV2.             |
| FR-5.4 | Submission posts to `POST /api/payments/authorize`.                                                                                                 |
| FR-5.5 | The server re-validates every field; the client is not trusted.                                                                                     |
| FR-5.6 | `4242 4242 4242 4242` is approved and `5555 5555 5555 4444` is declined, deterministically.                                                         |
| FR-5.7 | An approval credits the wallet using the intent id as the idempotency key, shows a receipt with a reference and masked card, and clears the intent. |
| FR-5.8 | A decline shows a localized reason and leaves the form usable.                                                                                      |
| FR-5.9 | Card details are never persisted, logged or returned. Only the masked card is echoed.                                                               |

### 2.6 Resume download

| ID     | Requirement                                                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| FR-6.1 | The first download costs 10,000 Toman.                                                                                                  |
| FR-6.2 | With enough balance, a dialog states the price, the balance and the balance after.                                                      |
| FR-6.3 | Confirming deducts the price, records a transaction and starts the download.                                                            |
| FR-6.4 | Without enough balance, the dialog explains the shortfall and links to the wallet.                                                      |
| FR-6.5 | After purchase the resume stays unlocked; later downloads are free.                                                                     |
| FR-6.6 | Repeated activation cannot charge twice: the store refuses once unlocked, and an in-flight guard rejects clicks before the next render. |

### 2.7 API

| ID     | Endpoint                       | Behaviour                                                                                               |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------------------- |
| FR-7.1 | `GET /api/health`              | `200` with status, uptime and timestamp; `Cache-Control: no-store`.                                     |
| FR-7.2 | `POST /api/payments/authorize` | `200` approved, `402` declined, `400` malformed, `413` oversized, `429` rate limited, `500` unexpected. |
| FR-7.3 | `POST /api/payments/authorize` | Bodies over 2 KB are rejected before parsing.                                                           |
| FR-7.4 | `POST /api/payments/authorize` | At most 12 requests per client per minute.                                                              |
| FR-7.5 | Both                           | Errors return a code only; no stack trace or internal detail leaves the server.                         |

## 3. Non-functional requirements

### 3.1 Responsiveness

| ID      | Requirement                                                                                                  |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| NFR-1.1 | Layouts are written mobile-first and verified at 375, 768 and 1280 px.                                       |
| NFR-1.2 | No horizontal overflow at any supported width.                                                               |
| NFR-1.3 | Interactive controls are at least 44 px tall on touch widths; compact styling starts at the `lg` breakpoint. |
| NFR-1.4 | Sheets respect `env(safe-area-inset-bottom)`.                                                                |

### 3.2 Accessibility

| ID      | Requirement                                                                                                       |
| ------- | ----------------------------------------------------------------------------------------------------------------- |
| NFR-2.1 | Text meets WCAG AA contrast in both themes (measured: body ≥ 16:1, secondary text ≥ 5.7:1, primary button ≥ 5:1). |
| NFR-2.2 | A skip link precedes the header.                                                                                  |
| NFR-2.3 | Invalid fields set `aria-invalid` and their message is announced via `role="alert"`.                              |
| NFR-2.4 | Icon-only controls carry an accessible name.                                                                      |
| NFR-2.5 | Animation is suppressed when `prefers-reduced-motion: reduce` is set.                                             |
| NFR-2.6 | Content is readable with JavaScript disabled; entrance animations do not hide it.                                 |

### 3.3 Performance

| ID      | Requirement                                                                                                             |
| ------- | ----------------------------------------------------------------------------------------------------------------------- |
| NFR-3.1 | All pages are statically generated per locale at build time.                                                            |
| NFR-3.2 | Components are Server Components unless they need state, effects or browser APIs.                                       |
| NFR-3.3 | Framer Motion is scoped to the portfolio page and loaded through `LazyMotion` with the `domAnimation` feature set.      |
| NFR-3.4 | Only the font family of the active locale is requested.                                                                 |
| NFR-3.5 | Store subscriptions use atomic selectors to avoid unrelated re-renders.                                                 |
| NFR-3.6 | The query client is mounted on the gateway route only. The portfolio route loads neither it nor the validation library. |

### 3.4 Security

| ID      | Requirement                                                                                                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-4.1 | No secrets exist in the repository or the image; there are none to hold.                                                                                                                 |
| NFR-4.2 | Responses carry `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` and a CSP limited to `frame-ancestors`, `base-uri`, `form-action` and `object-src`. |
| NFR-4.3 | `X-Powered-By` is disabled.                                                                                                                                                              |
| NFR-4.4 | The container runs as a non-root user with all capabilities dropped and `no-new-privileges`.                                                                                             |
| NFR-4.5 | Logs contain no payer-supplied data.                                                                                                                                                     |

### 3.5 Maintainability

| ID      | Requirement                                                                          |
| ------- | ------------------------------------------------------------------------------------ |
| NFR-5.1 | `any` is disallowed by lint; unsafe casts are avoided.                               |
| NFR-5.2 | Business rules live in `domain/` folders that import no React and no storage.        |
| NFR-5.3 | The amount rules exist once and are shared by both sheets.                           |
| NFR-5.4 | Lint, formatting, types, tests and build all run in CI and block a merge on failure. |

## 4. Constraints

- Node.js 20.9 or newer.
- Modern browsers only: Chrome/Edge 111+, Firefox 111+, Safari 16.4+ (the Next.js 16 baseline).
- Wallet data is per-browser. Clearing site data resets it, and it does not follow the visitor
  between devices.
- The rate limiter is in-process and therefore per-container.
