import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import { Activity, ShieldCheck, AlertTriangle, Waves } from "lucide-react";

export default function CompactCityHealth() {
  const { data } = useQuery({
    queryKey: ["city-health"],
    queryFn: async () => {
      const res = await api.get("/city-health");
      return res.data;
    },
    refetchInterval: 120000,
  });

  if (!data) return null;

  const scoreBand =
    data.score >= 75
      ? "Stable"
      : data.score >= 55
      ? "Under Watch"
      : "Critical";

  const ringColor =
    data.color === "green"
      ? "#22C55E"
      : data.color === "yellow"
      ? "#F59E0B"
      : "#EF4444";

  const healthTone =
    data.color === "green"
      ? "bg-green-100 text-green-700"
      : data.color === "yellow"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  const miniStats = [
    {
      label: "Violations",
      value: data.violations.toLocaleString(),
      icon: AlertTriangle,
      tone: "bg-red-50 text-red-700",
    },
    {
      label: "Avg PCI",
      value: `${(data.avg_pci * 100).toFixed(0)}%`,
      icon: Waves,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Health Band",
      value: scoreBand,
      icon: ShieldCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">City Health</h3>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${healthTone}`}>
          {data.status}
        </span>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-white p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Health Score
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{data.score}</p>
            <p className="text-sm text-slate-500">out of 100 citywide</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{scoreBand}</p>
          </div>

          <div className="relative h-24 w-24 flex-shrink-0">
            <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke="#E2E8F0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="48"
                cy="48"
                r="36"
                stroke={ringColor}
                strokeWidth="8"
                fill="none"
                strokeDasharray={226}
                strokeDashoffset={226 - (226 * data.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-900">{data.score}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">score</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {miniStats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {stat.label}
                </span>
                <div className={`rounded-lg p-1.5 ${stat.tone}`}>
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-base font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-[0.14em] text-slate-500">
            System Readiness
          </span>
          <span className="font-semibold text-slate-700">{data.score}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${data.score}%`,
              backgroundColor: ringColor,
            }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Composite health based on violations, PCI, and current risk posture.
        </p>
      </div>
    </div>
  );
}
