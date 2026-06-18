import { TrendingUp, Target, Zap, Award } from "lucide-react";

export default function EnforcementMetrics() {
  const metrics = [
    {
      label: "Resolution Rate",
      value: "79%",
      target: "85%",
      progress: 92.9,
      icon: Target,
      color: "blue",
    },
    {
      label: "Response Efficiency",
      value: "8.2 min",
      target: "< 10 min",
      progress: 82.0,
      icon: Zap,
      color: "purple",
    },
    {
      label: "Officer Productivity",
      value: "8.2/day",
      target: "10/day",
      progress: 82.0,
      icon: Award,
      color: "green",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-green-600" />
        <h3 className="text-base font-bold text-slate-800">Performance Metrics</h3>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="rounded-lg bg-slate-50 p-3 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 text-${metric.color}-600`} />
                  <span className="text-xs font-semibold text-slate-700">{metric.label}</span>
                </div>
                <span className="text-xs text-slate-500">Target: {metric.target}</span>
              </div>

              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-slate-900">{metric.value}</span>
                <span className="text-sm font-semibold text-green-600">{metric.progress.toFixed(0)}%</span>
              </div>

              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 transition-all duration-500`}
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Insights */}
      <div className="mt-4 rounded-lg border-2 border-green-200 bg-green-50 p-3">
        <p className="text-xs font-bold text-green-900 mb-1">✓ Performance Status</p>
        <p className="text-xs text-green-700">All metrics trending positively. Response time improved by 35% this month.</p>
      </div>
    </div>
  );
}
