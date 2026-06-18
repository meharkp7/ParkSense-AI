import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api/client";

export function useSeverity() {
  return useQuery({
    queryKey: ["severity"],

    queryFn: async () => {
      const response =
        await api.get(
          "/analytics/severity"
        );

      return response.data;
    },
  });
}