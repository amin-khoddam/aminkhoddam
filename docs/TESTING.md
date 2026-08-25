# Testing

## Strategy

The money rules and the gateway decision are pure functions, so they are covered by fast unit
tests with no DOM and no mocking. Everything above that — layout, direction, theming, motion —
is verified by hand against a short checklist, because automating it would cost more than it
would catch on a project this size.

```bash
npm test
npm run test:watch
npm run test:coverage
```

Vitest runs in the `node` environment (`vitest.config.mts`), collecting `src/**/*.test.ts`.
Coverage is reported for `src/features/**/domain/**` and `src/lib/**` — the layers where a
regression would be silent and expensive.

## What is covered

| Suite                                               | Covers                                                                                                                                           |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/money.test.ts`                             | Persian/Arabic digit normalization, parsing grouped input, rejecting unsafe integers, locale round-trip                                          |
| `src/features/wallet/domain/wallet.test.ts`         | Range boundaries, credit and debit, insufficient funds, duplicate references, resume unlocking, ordering, and that the snapshot is never mutated |
| `src/features/wallet/domain/schemas.test.ts`        | Amount validation messages, Persian digit input, the balance cap, and range taking precedence over the balance message                           |
| `src/features/payment/domain/card.test.ts`          | PAN normalization, grouping, masking, Luhn, and expiry edges including the current month                                                         |
| `src/features/payment/domain/authorization.test.ts` | Approval, both decline paths, amount bounds, and that the card number is never echoed                                                            |

Two tests exist specifically to protect properties that are easy to break later: transactions
being immutable, and the authorization result never containing the card number.

## Manual checklist

Run before a release, in both `fa` and `en`.

**Layout**

- [ ] 375, 768 and 1280 px: no horizontal scrolling
- [ ] Header collapses to the bottom-sheet menu below `lg`
- [ ] Interactive controls are comfortable to hit on a phone
- [ ] Bottom sheets clear the home indicator on iOS

**Direction**

- [ ] `fa` mirrors correctly; arrows point the right way
- [ ] Amounts render in Persian digits in `fa`, Latin in `en`
- [ ] Card number, CVV and reference stay left-to-right in both

**Theme**

- [ ] Light, System and Dark all apply and survive a reload
- [ ] No flash of the wrong theme on load
- [ ] Glass surfaces stay legible in both themes

**Wallet**

- [ ] Balance starts at 0 and survives a reload
- [ ] 49,999 and 10,000,001 are both rejected with the right message
- [ ] A withdrawal above the balance names the withdrawable maximum
- [ ] History shows newest first with localized dates

**Payment**

- [ ] `4242 4242 4242 4242` is approved and credits the balance once
- [ ] `5555 5555 5555 4444` is declined and leaves the balance untouched
- [ ] An expired card is rejected before submission
- [ ] Opening the gateway directly, with no intent, explains itself and links back

**Resume**

- [ ] With a balance below 10,000, the dialog explains the shortfall and links to the wallet
- [ ] Confirming deducts exactly once, even when the button is clicked repeatedly
- [ ] A later download is free and records no second transaction

**Accessibility**

- [ ] The skip link is reachable with the keyboard
- [ ] Every flow can be completed with the keyboard alone
- [ ] Validation errors are announced
- [ ] With reduced motion enabled, sheets and dialogs still open correctly

## CI

`.github/workflows/ci.yml` runs on pushes and pull requests to `main`:

1. Formatting (`format:check`)
2. Lint (`lint`)
3. Types (`typecheck`)
4. Unit tests (`test`)
5. Production build (`build`)
6. Docker image build, then a health-check smoke test against the running container

Any failing step fails the workflow.
