import {
  AlertTriangle,
  Brain,
  TrendingUp,
} from "lucide-react";

import { useInsights } from "@/hooks/useInsights";

export default function AIInsights() {
  const {
    data,
    isLoading,
    isError,
  } = useInsights();

  const iconMap: any = {
    warning: AlertTriangle,
    critical: AlertTriangle,
    recommendation: Brain,
    trend: TrendingUp,
  };

  const colorMap: any = {
    warning: {
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },

    critical: {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
    },

    recommendation: {
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },

    trend: {
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
    },
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        Loading insights...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
        Failed to load insights.
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        p-4
        shadow-sm
      "
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          AI Insights
        </h2>

        <p className="text-sm text-slate-500">
          Generated recommendations for traffic enforcement
        </p>
      </div>

      <div className="space-y-3">
        {data.map(
          (item: any, idx: number) => {
            const Icon =
              iconMap[item.type] ||
              Brain;

            const style =
              colorMap[item.type] ||
              colorMap.recommendation;

            return (
              <div
                key={idx}
                className={`
                  rounded-xl
                  p-3
                  border
                  ${style.border}
                  ${style.bg}
                `}
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className={`h-5 w-5 mt-1 ${style.color}`}
                  />

                  <div>
                    <h3
                      className={`font-semibold ${style.color}`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}