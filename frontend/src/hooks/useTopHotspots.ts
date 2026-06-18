import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";

export function useTopHotspots() {
  return useQuery({
    queryKey: ["top-hotspots"],

    queryFn: async () => {
      const response =
        await api.get(
          "/hotspots/top"
        );

      return response.data;
    },
  });
}