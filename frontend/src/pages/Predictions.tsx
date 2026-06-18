import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import { TrendingUp, MapPin, Clock, Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Predictions() {
  const { data: timeline } = useQuery({
    queryKey: ["forecast-timeline"],
    queryFn: async () => {
      const res = await api.get("/forecast/timeline");
      return res.data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["forecast-locations"],
    queryFn: async () => {
      const res = await api.get("/forecast/locations");
      return res.data;
    },
  });

  const { data: hourly } = useQuery({
    queryKey: ["forecast-hourly"],
    queryFn: async () => {
      const res = await api.get("/forecast/hourly");
      return res.data;
    },
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return { bg: "bg-red-600", light: "bg-red-50", text: "text-red-600", border: "border-red-300" };
      case "HIGH":
        return { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600", border: "border-orange-300" };
      case "MEDIUM":
        return { bg: "bg-yellow-500", light: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-300" };
      default:
        return { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600", border: "border-green-300" };
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing" || trend === "critical") return "📈";
    if (trend === "decreasing") return "📉";
    return "➡️";
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Future Congestion Forecasting</h1>
          <p className="text-sm text-slate-500">AI-powered predictions based on historical patterns and current trends</p>
        </div>

        {/* Time-based Forecasts */}
        {timeline && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {timeline.forecasts.map((forecast: any, idx: number) => {
              const colors = getRiskColor(forecast.risk.level);
              return (
                <div key={idx} className={`rounded-lg border-2 ${colors.border} ${colors.light} p-4 shadow-md hover:shadow-lg transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <Clock className={`h-5 w-5 ${colors.text}`} />
                    <span className={`rounded-full px-2 py-1 text-xs font-bold text-white ${colors.bg}`}>
                      {forecast.risk.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{forecast.timeframe}</h3>
                  <p className="text-sm text-slate-600 mb-3">{forecast.time}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-white">
                      <span className="text-xs text-slate-600">PCI Forecast</span>
                      <span className="text-sm font-bold text-slate-900">{(forecast.pci * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-md bg-white">
                      <span className="text-xs text-slate-600">Expected Violations</span>
                      <span className="text-sm font-bold text-slate-900">{forecast.expected_violations}</span>
                    </div>
                  </div>
                  
                  <div className={`mt-3 rounded-md border ${colors.border} bg-white p-2`}>
                    <p className={`text-xs font-semibold ${colors.text}`}>Action</p>
                    <p className="text-xs text-slate-700 mt-1">{forecast.recommendation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 24-Hour Forecast Chart */}
        {hourly && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-700">24-Hour Congestion Forecast</h3>
              </div>
              <span className="text-xs text-slate-500">{hourly.forecast_date}</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourly.hourly_forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="pci" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: "#3B82F6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Location-specific Forecasts */}
        {locations && (
          <div>
            <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              Location-Specific Forecasts
            </h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {locations.locations.map((location: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{location.location}</h4>
                      <p className="text-xs text-slate-500">Peak: {location.peak_time}</p>
                    </div>
                    <span className="text-xl">{getTrendIcon(location.trend)}</span>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Current PCI</span>
                      <span className="text-sm font-bold text-slate-900">{(location.current_pci * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Next 1 Hour</span>
                      <span className={`text-sm font-bold ${location.forecast_1hr > location.current_pci ? 'text-red-600' : 'text-green-600'}`}>
                        {(location.forecast_1hr * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">Next 3 Hours</span>
                      <span className={`text-sm font-bold ${location.forecast_3hr > location.current_pci ? 'text-red-600' : 'text-green-600'}`}>
                        {(location.forecast_3hr * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600">Recommended Units</span>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {location.recommended_units} units
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-full bg-blue-600 p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-blue-900">🤖 AI Analysis</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-blue-800">
              • <strong>Peak congestion expected at 6:00 PM</strong> - Deploy additional units to MG Road and Indiranagar areas
            </p>
            <p className="text-sm text-blue-800">
              • <strong>KR Market showing critical levels</strong> - Immediate intervention required with 5 enforcement units
            </p>
            <p className="text-sm text-blue-800">
              • <strong>Whitefield congestion increasing</strong> - Monitor closely and prepare for morning rush deployment
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
