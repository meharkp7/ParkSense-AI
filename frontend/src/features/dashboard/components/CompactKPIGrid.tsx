import { useKPIs } from "@/hooks/useKPIs";
import { AlertTriangle, MapPin, TrendingUp, Shield, Activity, Clock } from "lucide-react";

export default function CompactKPIGrid() {
  const { data, isLoading } = useKPIs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      icon: AlertTriangle,
      label: "Violations",
      value: data.total_violations.toLocaleString(),
      color: "text-red-600",
      bg: "bg-red-50",
      trend: "+12%"
    },
    {
      icon: MapPin,
      label: "Hotspots",
      value: data.hotspots,
      color: "text-orange-600",
      bg: "bg-orange-50",
      trend: "+5"
    },
    {
      icon: TrendingUp,
      label: "Avg PCI",
      value: `${Math.round(data.avg_pci * 100)}%`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "-3%"
    },
    {
      icon: Shield,
      label: "Risk Zones",
      value: data.high_risk_zones,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "8"
    },
    {
      icon: Activity,
      label: "Active Units",
      value: "24",
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "Live"
    },
    {
      icon: Clock,
      label: "Avg Response",
      value: "8m",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      trend: "-2m"
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className={`
              rounded-lg border border-slate-200 bg-white p-3 transition-all hover:shadow-md
            `}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-md ${metric.bg} p-2`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
              <span className="text-xs font-medium text-slate-500">
                {metric.trend}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-xs text-slate-500">{metric.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
