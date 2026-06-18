import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export function useInsights() {
  return useQuery({
    queryKey: ["ai-insights"],

    queryFn: async () => {
      const res = await api.get(
        "/ai/insights"
      );

      return res.data;
    },

    refetchInterval: 30000,
  });
}