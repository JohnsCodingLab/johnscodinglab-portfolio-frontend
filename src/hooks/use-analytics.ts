import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, PageView } from "@/types";

// The exact shape returned by GET /analytics/stats from your backend
export interface BackendStats {
    totalViews: number;
    uniqueVisitors: number;
    topPages: {
        path: string;
        _count: { path: number };
    }[];
    recentViews: PageView[];
}

export function useAnalyticsStats() {
    return useQuery({
        queryKey: ["analytics", "stats"],
        queryFn: async () => {
            const { data } =
                await api.get<ApiResponse<BackendStats>>("/analytics/stats");
            return data.data;
        },
    });
}
