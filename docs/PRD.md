# Product Requirements — Portfolio & Wallet Demo

## 1. Purpose

Give a frontend developer with about three years of experience a personal site that does two
jobs at once:

1. Present the person — who they are, what they have shipped, how to reach them.
2. Prove the claim, by shipping a small fintech-style wallet inside the same product rather
   than describing one in prose.

The wallet is deliberately small. It exists to demonstrate architecture, validation, financial
flows and interface quality, not to be a payment product.

## 2. Audience

- Hiring managers and technical recruiters skimming for signal in under a minute.
- Engineers who will open the repository and judge the code.
- Persian-speaking and English-speaking readers, with equal quality in both.

## 3. Scope

### In scope

| Area      | Delivered                                                                        |
| --------- | -------------------------------------------------------------------------------- |
| Portfolio | Hero, about, skills, experience, projects, contact — one page, anchored sections |
| Wallet    | Balance, top-up, withdrawal, transaction history                                 |
| Payment   | A simulated bank gateway page with card entry and result states                  |
| Resume    | A paid download that draws from the wallet balance                               |
| Platform  | Two locales with RTL/LTR, three theme modes, responsive from 320px up            |

### Out of scope

- Real payment processing, bank integration or money movement of any kind.
- User accounts, authentication or server-side persistence.
- A CMS, blog or admin area.
- Analytics, A/B testing or marketing instrumentation.

## 4. Flows

### 4.1 Add balance

1. From the wallet, the visitor opens **Add balance**.
2. A bottom sheet asks for an amount and validates it on every keystroke against
   50,000–10,000,000 Toman. The submit button stays disabled while the value is invalid.
3. Continuing creates a payment intent and navigates to the gateway page.
4. The gateway collects card number, expiry and CVV2, validating each field as it is typed.
5. Submitting sends the details to the app's own authorization endpoint.
6. Approved: the balance increases, a `topup` transaction is recorded, and a receipt with a
   reference number and masked card is shown.
   Declined: an inline reason is shown and the form stays available for another attempt.

The intent id is the idempotency key, so a repeated authorization cannot credit twice.

### 4.2 Withdraw

1. From the wallet, the visitor opens **Withdraw**.
2. The same bottom sheet applies the same 50,000–10,000,000 range, plus a balance check.
3. Requesting more than the balance shows an immediate error that names the maximum that can
   be withdrawn right now.
4. Confirming deducts the amount and records a `withdrawal` transaction.

No transfer is performed; the demo states this on the page.

### 4.3 Resume download

1. The **Resume** action appears in the header, the hero and the contact section.
2. With enough balance, a dialog shows the price, the current balance and the balance after
   the purchase.
3. Confirming deducts 10,000 Toman, records a `resume_purchase` transaction and starts the
   download.
4. Without enough balance, the dialog explains the shortfall and offers a route to the wallet.
5. Once purchased, the resume stays unlocked and later downloads are free — a repeated click
   never charges a second time.

## 5. Content rules

- All personal data is placeholder data, marked as such on the contact card and inside the
  resume PDF itself.
- Every visible string exists in both `fa` and `en`. Nothing user-facing is hard-coded in a
  component.
- Amounts are formatted with the active locale's numbering system: Persian digits and
  separators in `fa`, Latin in `en`.

## 6. Success criteria

| Criterion                                                                      | How it is verified                         |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| The portfolio reads as a real developer site, not a template                   | Design review                              |
| Both locales render correctly, including mirrored layout and localized numbers | Manual pass in `fa` and `en`               |
| Wallet balance survives a reload                                               | Manual pass                                |
| Amount rules are enforced identically in the top-up and withdrawal sheets      | Unit tests on the shared schema            |
| The visitor is never charged twice for one action                              | Unit tests plus a manual repeat-click pass |
| Every user-facing string is translated                                         | Key-parity check between catalogs          |
| Lint, types, tests and build all pass                                          | CI                                         |

## 7. Explicit non-goals

- No feature is added because a library supports it. Each dependency in the stack is used at
  one place where it genuinely fits, and the reasoning is recorded in `ARCHITECTURE.md`.
- No backend, database or queue is introduced to make the project look larger than it is.
