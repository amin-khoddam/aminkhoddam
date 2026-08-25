/**
 * Simulated gateway configuration.
 *
 * The card numbers below are the industry-standard test PANs. They are not
 * usable against any real network and exist so the demo has a deterministic
 * approved path and a deterministic declined path.
 */
export const APPROVED_TEST_CARD = "4242424242424242";
export const DECLINED_TEST_CARD = "5555555555554444";

/** Artificial latency so the processing state is visible. */
export const GATEWAY_LATENCY_MS = 900;

export const CARD_NUMBER_LENGTH = 16;

/** Requests allowed per client per window on the authorization endpoint. */
export const AUTHORIZE_RATE_LIMIT = { limit: 12, windowMs: 60_000 } as const;
