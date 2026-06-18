import { Flame } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function MiniHotspots() {
  const { data } = useQuery({
    queryKey: ["top-hotspots"],
    queryFn: async () => {
      const res = await api.get("/hotspots");
      return res.data;
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "bg-red-50", text: "text-red-700", border: "border-red-300", icon: "bg-red-500", badge: "bg-red-600" };
      case "HIGH":
        return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300", icon: "bg-orange-500", badge: "bg-orange-600" };
      case "MEDIUM":
        return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-300", icon: "bg-amber-500", badge: "bg-amber-600" };
      default:
        return { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300", icon: "bg-yellow-500", badge: "bg-yellow-600" };
    }
  };

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-600" />
          <h3 className="text-base font-semibold text-slate-700">Active Hotspots</h3>
        </div>
        <span className="text-xs text-slate-500">{data?.length || 0} zones</span>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-red-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-red-600">
            {data?.filter((hotspot: any) => hotspot.severity === "CRITICAL").length || 0}
          </p>
          <p className="text-[11px] text-slate-500">Critical</p>
        </div>
        <div className="rounded-lg bg-orange-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-orange-600">
            {data?.filter((hotspot: any) => hotspot.severity === "HIGH").length || 0}
          </p>
          <p className="text-[11px] text-slate-500">High</p>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
          <p className="text-lg font-bold text-slate-900">{data?.length || 0}</p>
          <p className="text-[11px] text-slate-500">Tracked</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[230px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {data?.slice(0, 4).map((hotspot: any, idx: number) => {
          const colors = getSeverityColor(hotspot.severity);
          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-lg border ${colors.border} ${colors.bg} p-3 transition-all hover:shadow-md`}
            >
              <div className={`h-10 w-10 rounded-full ${colors.badge} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                #{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{hotspot.location}</p>
                <p className="text-xs text-slate-600">
                  {hotspot.violations} violations • Zone {hotspot.hotspot_id}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors.text} bg-white border ${colors.border} flex-shrink-0`}>
                {hotspot.severity}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}
