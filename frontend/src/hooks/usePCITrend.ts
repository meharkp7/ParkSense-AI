import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";
import type { PCITrend } from "@/types/analytics";

export function usePCITrend() {
  return useQuery<PCITrend[]>({
    queryKey: ["pci-trend"],

    queryFn: async () => {
      const response = await api.get(
        "/analytics/pci"
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });
}