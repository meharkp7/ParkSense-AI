import { AlertTriangle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function CompactAlertFeed() {
  const { data } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await api.get("/alerts");
      return res.data.slice(0, 5); // Only show top 5
    },
    refetchInterval: 120000,
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-semibold text-slate-700">Live Alerts</h3>
        </div>
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
          {data?.length || 0} Active
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data?.map((alert: any, idx: number) => (
          <div
            key={idx}
            className={`
              rounded-md border p-2
              ${
                alert.severity === "CRITICAL"
                  ? "border-red-300 bg-red-50"
                  : alert.severity === "HIGH"
                  ? "border-orange-300 bg-orange-50"
                  : "border-yellow-300 bg-yellow-50"
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900">
                  {alert.location}
                </p>
                <p className="text-xs text-slate-600">{alert.message}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
              <span
                className={`
                  rounded-full px-2 py-0.5 text-xs font-bold
                  ${
                    alert.severity === "CRITICAL"
                      ? "bg-red-600 text-white"
                      : alert.severity === "HIGH"
                      ? "bg-orange-600 text-white"
                      : "bg-yellow-600 text-white"
                  }
                `}
              >
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
