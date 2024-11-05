"use client";

import { useState } from "react";
import superjson from "superjson";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";

import { trpc } from "@/lib/trpc-client";

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  function getBaseUrl() {
    if (typeof window !== "undefined") {
      return "";
    }

    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }

    if (process.env.RENDER_INTERNAL_HOSTNAME) {
      return `https://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
    }

    return `http://localhost:${process.env.PORT ?? 3000}`;
  }

  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
