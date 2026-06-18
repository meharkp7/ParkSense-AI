import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export function useTimeline(
  location: string
) {
  return useQuery({
    queryKey: [
      "timeline",
      location,
    ],

    queryFn: async () => {
      const res =
        await api.get(
          "/timeline",
          {
            params: {
              location,
            },
          }
        );

      return res.data;
    },

    enabled:
      !!location,
  });
}