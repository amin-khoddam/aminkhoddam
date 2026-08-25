import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleI18nRouting(request);
}

export const config = {
  // Skip API routes, Next.js internals and anything that looks like a file.
  matcher: ["/((?!api|_next|_vercel|.*\..*).*)"],
};
