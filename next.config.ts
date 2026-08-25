import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Headers applied to every response. Kept conservative on purpose: a nonce-based
 * script CSP is not viable without a custom document, so we only lock down the
 * directives that cannot break Next.js' inline runtime.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
] as const;

const nextConfig: NextConfig = {
  // Emits a self-contained server bundle so the production image only ships
  // the files the server actually needs.
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders] }];
  },
};

export default createNextIntlPlugin()(nextConfig);
