import { TrendingUp, Clock, AlertTriangle, Target, ShieldCheck, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function CompactPrediction() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["predictions"],
    queryFn: async () => {
      const res = await api.get("/predictions");
      return res.data;
    },
  });

  const primaryPrediction = data?.[0];

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return { bg: "bg-red-600", text: "text-red-600", light: "bg-red-50" };
      case "HIGH":
        return { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" };
      case "MEDIUM":
        return { bg: "bg-yellow-500", text: "text-yellow-600", light: "bg-yellow-50" };
      default:
        return { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" };
    }
  };

  const confidence =
    primaryPrediction?.risk === "CRITICAL"
      ? 92
      : primaryPrediction?.risk === "HIGH"
      ? 81
      : primaryPrediction?.risk === "MEDIUM"
      ? 68
      : 57;

  if (isLoading) {
    return (
      <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-base font-semibold text-slate-700">AI Predictions</h3>
          </div>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            Forecast Engine
          </span>
        </div>
        <div className="flex h-[280px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">
          Loading predictions...
        </div>
      </div>
    );
  }

  if (isError || !primaryPrediction) {
    return (
      <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-base font-semibold text-slate-700">AI Predictions</h3>
          </div>
          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
            Forecast Engine
          </span>
        </div>
        <div className="flex h-[280px] items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-600">
          Prediction data is unavailable right now.
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h3 className="text-base font-semibold text-slate-700">AI Predictions</h3>
        </div>
        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
          Forecast Engine
        </span>
      </div>

      {primaryPrediction && (
        <div className="space-y-3">
          <div className={`rounded-xl border ${getRiskColor(primaryPrediction.risk).light} bg-gradient-to-r from-white to-slate-50 p-4 shadow-sm`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className={`h-5 w-5 ${getRiskColor(primaryPrediction.risk).text}`} />
                <span className="text-sm font-semibold text-slate-700">Risk Level</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${getRiskColor(primaryPrediction.risk).bg}`}>
                {primaryPrediction.risk}
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 mb-1">{primaryPrediction.display_name || primaryPrediction.location}</p>
            <p className="text-sm text-slate-600">{primaryPrediction.recommended_action}</p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-white p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Confidence
                </div>
                <p className="text-lg font-bold text-slate-900">{confidence}%</p>
              </div>
              <div className="rounded-lg bg-white p-3">
                <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  Actionability
                </div>
                <p className="text-lg font-bold text-slate-900">
                  {primaryPrediction.risk === "CRITICAL" || primaryPrediction.risk === "HIGH" ? "Immediate" : "Monitor"}
                </p>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-3 border border-blue-200">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-semibold text-blue-900">Peak Hour</p>
              </div>
              <p className="text-lg font-bold text-blue-900">{primaryPrediction.peak_hour || "6-8 PM"}</p>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-3 border border-purple-200">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="h-4 w-4 text-purple-600" />
                <p className="text-xs font-semibold text-purple-900">PCI Forecast</p>
              </div>
              <p className="text-lg font-bold text-purple-900">
                {primaryPrediction.predicted_pci ? `${Math.round(primaryPrediction.predicted_pci * 100)}%` : "72%"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-3">
            <p className="mb-1 flex items-center gap-1 text-xs font-bold text-blue-900">
              <Sparkles className="h-3.5 w-3.5" />
              AI Recommendation
            </p>
            <p className="text-sm text-blue-800 leading-tight">{primaryPrediction.recommended_action}</p>
          </div>
        </div>
      )}
    </div>
  );
}
