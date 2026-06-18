import { Activity, AlertOctagon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function CompactAnomaly() {
  const { data } = useQuery({
    queryKey: ["anomalies"],
    queryFn: async () => {
      const res = await api.get("/anomaly/detect");
      return res.data.slice(0, 4);
    },
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-700">Anomaly Detection</h3>
        </div>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
          {data?.length || 0} Detected
        </span>
      </div>

      <div className="space-y-2">
        {data?.map((anomaly: any, idx: number) => (
          <div
            key={idx}
            className={`
              rounded-md border p-3
              ${
                anomaly.severity === "HIGH"
                  ? "border-red-200 bg-red-50"
                  : anomaly.severity === "MEDIUM"
                  ? "border-orange-200 bg-orange-50"
                  : "border-yellow-200 bg-yellow-50"
              }
            `}
          >
            <div className="flex items-start gap-2">
              <AlertOctagon className="h-4 w-4 mt-0.5 text-red-600" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-slate-900">{anomaly.location}</p>
                  <span className={`
                    rounded-full px-2 py-0.5 text-xs font-bold
                    ${anomaly.severity === "HIGH" ? "bg-red-600 text-white" : "bg-orange-600 text-white"}
                  `}>
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mb-1">{anomaly.reason}</p>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>📊 Z-Score: {anomaly.z_score}</span>
                  <span>🚗 {anomaly.violations} violations</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-2">
        <p className="text-xs text-slate-600">
          <span className="font-semibold">Detection Method:</span> Z-score analysis identifying abnormal spikes beyond 2σ threshold
        </p>
      </div>
    </div>
  );
}
