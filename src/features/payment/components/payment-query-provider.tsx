"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * The gateway is the only place that talks to a server, so the query client is
 * mounted here rather than at the root. Routes without server state do not load
 * the library at all.
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // A payment must never be retried automatically.
      mutations: { retry: false },
      queries: { retry: 1, refetchOnWindowFocus: false },
    },
  });
}

export function PaymentQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
