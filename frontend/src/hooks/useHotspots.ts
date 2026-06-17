import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";
import type { Hotspot } from "@/types/hotspot";

export function useHotspots() {
  return useQuery<Hotspot[]>({
    queryKey: ["hotspots"],

    queryFn: async () => {
      const response = await api.get("/hotspots");
      return response.data;
    },

    staleTime: 1000 * 60 * 5,
  });
}