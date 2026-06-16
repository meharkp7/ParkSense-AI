import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";
import type { KPIResponse } from "@/types/dashboard";

export function useKPIs() {
  return useQuery<KPIResponse>({
    queryKey: ["kpis"],

    queryFn: async () => {
      const response = await api.get("/kpis");
      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });
}