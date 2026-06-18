import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";

export function useHotspots() {
  return useQuery({
  queryKey: ["hotspots"],

  queryFn: async () => {
    const res =
      await api.get(
        "/hotspots"
      );

    return res.data;
  },

  refetchInterval:
    30000,

  staleTime: 10000,
});
}