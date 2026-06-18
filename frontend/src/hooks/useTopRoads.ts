import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";
import type { Road } from "@/types/roads";

export function useTopRoads() {
  return useQuery<Road[]>({
    queryKey: ["top-roads"],

    queryFn: async () => {
      const response = await api.get(
        "/roads/top"
      );

      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });
}