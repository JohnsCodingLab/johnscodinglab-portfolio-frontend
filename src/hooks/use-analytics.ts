import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, PageView } from "@/types";

// Summary shape returned by your backend
export interface AnalyticsSummary {
    totalViews: number;
    last7Days: number;
    last30Days: number;
    topPages: { path: string; count: number }[];
    topReferrers: { referrer: string; count: number }[];
    countries: { country: string; count: number }[];
}

export function useAnalyticsSummary(period: "7d" | "30d" | "90d" = "30d") {
    return useQuery({
        queryKey: ["analytics", "summary", period],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<AnalyticsSummary>>(
                `/analytics/summary?period=${period}`,
            );
            return data.data;
        },
    });
}

export function usePageViews(period: "7d" | "30d" | "90d" = "30d") {
    return useQuery({
        queryKey: ["analytics", "page-views", period],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<PageView[]>>(
                `/analytics/page-views?period=${period}`,
            );
            return data.data;
        },
    });
}
