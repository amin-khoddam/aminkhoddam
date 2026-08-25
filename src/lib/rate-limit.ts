interface Window {
  count: number;
  expiresAt: number;
}

const windows = new Map<string, Window>();

/** Bounds memory growth for a long-running single-instance server. */
const PRUNE_THRESHOLD = 1_000;

function prune(now: number) {
  for (const [key, window] of windows) {
    if (window.expiresAt <= now) windows.delete(key);
  }
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window limiter held in process memory.
 *
 * Adequate for a single-container deployment of this demo. A multi-instance
 * deployment would need a shared store; the call sites do not change.
 */
export function consumeRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();

  if (windows.size > PRUNE_THRESHOLD) prune(now);

  const current = windows.get(key);

  if (!current || current.expiresAt <= now) {
    windows.set(key, { count: 1, expiresAt: now + options.windowMs });
    return { allowed: true, remaining: options.limit - 1, retryAfterSeconds: 0 };
  }

  current.count += 1;

  if (current.count > options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.expiresAt - now) / 1000)),
    };
  }

  return { allowed: true, remaining: options.limit - current.count, retryAfterSeconds: 0 };
}

/** Best-effort client identity for rate limiting. */
export function clientKeyFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
