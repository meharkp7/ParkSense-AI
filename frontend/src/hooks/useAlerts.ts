import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";

export function useAlerts() {
  return useQuery({
    queryKey: ["alerts"],

    queryFn: async () => {
      const res =
        await api.get(
          "/alerts"
        );

      return res.data;
    },

    refetchInterval: 120000,
  });
}
