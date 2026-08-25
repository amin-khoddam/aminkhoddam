import { z } from "zod";

/**
 * Environment contract for the app.
 *
 * `NEXT_PUBLIC_*` values must be referenced statically so Next.js can inline
 * them into the client bundle, hence the explicit object below.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  /** Absolute origin used for canonical URLs and social metadata. */
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  const issues = parsed.error.issues.map(
    (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
  );
  throw new Error(`Invalid environment configuration:\n${issues.join("\n")}`);
}

export const env = parsed.data;
