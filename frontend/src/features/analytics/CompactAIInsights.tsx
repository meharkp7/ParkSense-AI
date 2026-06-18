import { Brain, TrendingUp, AlertTriangle, Lightbulb, Radar } from "lucide-react";
import { useInsights } from "@/hooks/useInsights";

export default function CompactAIInsights() {
  const { data } = useInsights();

  const iconMap: any = {
    warning: AlertTriangle,
    critical: AlertTriangle,
    recommendation: Lightbulb,
    trend: TrendingUp,
  };

  const colorMap: any = {
    warning: { icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300" },
    critical: { icon: "text-red-600", bg: "bg-red-50", border: "border-red-300" },
    recommendation: { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" },
    trend: { icon: "text-green-600", bg: "bg-green-50", border: "border-green-300" },
  };

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          <h3 className="text-base font-semibold text-slate-700">AI Insights</h3>
        </div>
        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
          Live Signals
        </span>
      </div>

      <div className="mb-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Insight Engine</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{data?.length || 0} active findings</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
            <Radar className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto">
        {data?.slice(0, 3).map((item: any, idx: number) => {
          const Icon = iconMap[item.type] || Brain;
          const colors = colorMap[item.type] || colorMap.recommendation;
          return (
            <div
              key={idx}
              className={`rounded-xl border ${colors.border} ${colors.bg} p-3 transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-2">
                <div className={`rounded-lg p-2 ${colors.bg}`}>
                  <Icon className={`h-4 w-4 ${colors.icon}`} />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    <span className={`rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase ${colors.icon}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-tight">{item.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
