import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { routing } from "@/i18n/routing";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The gateway is a transient step in a flow; there is nothing to index.
        disallow: ["/api/", ...routing.locales.map((locale) => `/${locale}/wallet/payment`)],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
