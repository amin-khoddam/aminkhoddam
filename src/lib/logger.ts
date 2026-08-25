type LogMeta = Record<string, string | number | boolean>;

/**
 * Minimal structured server logger.
 *
 * Callers must pass only non-sensitive metadata: card numbers, CVV values and
 * anything else supplied by a payer never reach this function.
 */
function write(level: "error", message: string, meta?: LogMeta) {
  const entry = JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  });

  console.error(entry);
}

export const logger = {
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
};
