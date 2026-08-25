import axios from "axios";

/**
 * Single place where the app talks to its own API routes: base path, timeout
 * and JSON headers live here instead of at each call site.
 */
export const apiClient = axios.create({
  baseURL: "/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
  // Business failures (a declined card) come back as 4xx payloads we want to read.
  validateStatus: (status) => status < 500,
});
