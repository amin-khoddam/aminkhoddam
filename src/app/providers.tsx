"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

/**
 * Application-wide providers. Only theming belongs here — anything narrower is
 * mounted at the route that needs it so the rest of the app does not carry it.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="amin-khoddam.theme"
    >
      {children}
    </ThemeProvider>
  );
}
