/** All amounts are whole Toman. Never use floating point for money. */

export const MIN_TRANSACTION_AMOUNT = 50_000;
export const MAX_TRANSACTION_AMOUNT = 10_000_000;

/** Price charged once for unlocking the resume download. */
export const RESUME_PRICE = 10_000;

export const QUICK_TOP_UP_AMOUNTS = [100_000, 500_000, 1_000_000, 2_000_000] as const;

/** Keeps persisted wallet data bounded in local storage. */
export const MAX_STORED_TRANSACTIONS = 100;
export const MAX_STORED_REFERENCES = 200;
