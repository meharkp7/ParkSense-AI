import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import { AlertCircle, Users, Clock, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";

export default function EnforcementStats() {
  const { data } = useQuery({
    queryKey: ["enforcement-stats"],
    queryFn: async () => {
      const res = await api.get("/enforcement/stats");
      return res.data;
    },
    refetchInterval: 10000,
  });

  const stats = [
    {
      label: "Active Alerts",
      value: data?.alerts_today || "20",
      change: "+5",
      trend: "up",
      icon: AlertCircle,
      color: "blue",
      bgGradient: "from-blue-500 to-cyan-500"
    },
    {
      label: "Resolved Today",
      value: data?.resolved_today || "198",
      change: "+12%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
      bgGradient: "from-green-500 to-emerald-500"
    },
    {
      label: "Officers Active",
      value: data?.officers_active || "24",
      change: "100%",
      trend: "stable",
      icon: Users,
      color: "purple",
      bgGradient: "from-purple-500 to-pink-500"
    },
    {
      label: "Avg Response",
      value: data?.avg_response_time || "8m",
      change: "-2m",
      trend: "down",
      icon: Clock,
      color: "orange",
      bgGradient: "from-orange-500 to-red-500"
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.bgGradient} opacity-10 rounded-bl-full`} />
            
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className={`rounded-lg bg-gradient-to-br ${stat.bgGradient} p-2`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-green-600" />}
                  <span className={`text-xs font-bold ${stat.trend === "down" ? "text-green-600" : "text-blue-600"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
