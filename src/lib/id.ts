/**
 * Generates a unique id. `crypto.randomUUID` is unavailable in insecure
 * browsing contexts, so a random fallback keeps the demo usable there.
 */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
