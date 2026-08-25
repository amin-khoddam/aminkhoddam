import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { routing } from "@/i18n/routing";

const INDEXABLE_PATHS = ["", "/wallet"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    INDEXABLE_PATHS.map((path) => ({
      url: `${env.NEXT_PUBLIC_SITE_URL}/${locale}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alternate) => [
            alternate,
            `${env.NEXT_PUBLIC_SITE_URL}/${alternate}${path}`,
          ]),
        ),
      },
    })),
  );
}
