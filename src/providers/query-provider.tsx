"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    // useState ensures a new QueryClient is not created on every render
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // How long before data is considered stale (30 seconds)
                        staleTime: 30 * 1000,
                        // How long unused data stays in the cache (5 minutes)
                        gcTime: 5 * 60 * 1000,
                        // Retry once on failure before showing error
                        retry: 1,
                        // Don't refetch when the browser window is refocused
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* Only shows in development — inspect your cache here */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
