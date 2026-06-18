import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function EventTicker() {
  const { data } = useQuery({
    queryKey: ["events"],

    queryFn: async () => {
      const res = await api.get(
        "/events"
      );

      return res.data;
    },
  });

  if (!data) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-red-100 bg-red-50 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
        {data.map(
            (event: any, idx: number) => (
            <div
                key={idx}
                className="
                mx-6
                flex
                items-center
                gap-2
                text-sm
                text-slate-700
                "
            >
                <span>
                {event.severity ===
                "critical"
                    ? "🔴"
                    : event.severity ===
                    "warning"
                    ? "🟠"
                    : "🟢"}
                </span>

                <span>
                {event.message}
                </span>

                <span className="font-semibold">
                {event.location}
                </span>
            </div>
            )
        )}
        </div>
    </div>
  );
}