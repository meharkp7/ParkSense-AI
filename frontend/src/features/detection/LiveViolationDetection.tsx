import { useState, useEffect, useCallback } from "react";
import { Camera, AlertCircle, Clock, ShieldAlert, ScanLine, RefreshCw } from "lucide-react";
import { api } from "@/services/api/client";

interface Detection {
  id: string;
  vehicle_id: string;
  location: string;
  duration: number;
  status: "detecting" | "confirmed" | "alerted";
  timestamp: string;
  camera_id: string;
  pci?: number;
  confidence?: number;
}

interface DetectionStats {
  cameras_online: number;
  cameras_total: number;
  detections_today: number;
  violations_confirmed: number;
  system_accuracy: number;
}

interface LiveResponse {
  total: number;
  detecting: number;
  confirmed: number;
  alerted: number;
  detections: Detection[];
}

export default function LiveViolationDetection() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [summary, setSummary] = useState({ detecting: 0, confirmed: 0, alerted: 0 });
  const [stats, setStats] = useState<DetectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [liveRes, statsRes] = await Promise.all([
        api.get<LiveResponse>("/detection/live"),
        api.get<DetectionStats>("/detection/stats"),
      ]);
      setDetections(liveRes.data.detections.slice(0, 8));
      setSummary({
        detecting: liveRes.data.detecting,
        confirmed: liveRes.data.confirmed,
        alerted: liveRes.data.alerted,
      });
      setStats(statsRes.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError("Could not reach detection API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const id = setInterval(fetchData, 30_000);
    return () => clearInterval(id);
  }, [fetchData]);

  const statusBadge = (status: Detection["status"]) => {
    switch (status) {
      case "alerted":   return { bg: "bg-red-200 text-red-700",    label: "ALERTED"    };
      case "confirmed": return { bg: "bg-amber-200 text-amber-700", label: "VIOLATION" };
      default:          return { bg: "bg-blue-200 text-blue-700",   label: "TRACKING"  };
    }
  };

  const rowBg = (status: Detection["status"]) => {
    switch (status) {
      case "alerted":   return "border-red-200 bg-red-50";
      case "confirmed": return "border-amber-200 bg-amber-50";
      default:          return "border-blue-200 bg-blue-50";
    }
  };

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">Live Violation Detection</h3>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchData}
            className="rounded p-1 hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3 text-slate-500" />
          </button>
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
            LIVE
          </span>
        </div>
      </div>

      {/* Model badge */}
      <div className="mb-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Detection Layer</p>
            <p className="mt-1 text-lg font-bold text-slate-900">YOLOv11 + ByteTrack</p>
            {stats && (
              <p className="text-xs text-slate-500">
                {stats.cameras_online}/{stats.cameras_total} cameras · {(stats.system_accuracy * 100).toFixed(0)}% accuracy
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700"><ScanLine className="h-4 w-4" /></div>
            <div className="rounded-lg bg-red-50 p-2 text-red-700"><ShieldAlert className="h-4 w-4" /></div>
          </div>
        </div>
      </div>

      {/* Summary counts */}
      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-lg font-bold text-blue-600">{loading ? "—" : summary.detecting}</p>
          <p className="text-xs text-blue-600">Detecting</p>
        </div>
        <div className="rounded-md bg-amber-50 p-2">
          <p className="text-lg font-bold text-amber-600">{loading ? "—" : summary.confirmed}</p>
          <p className="text-xs text-amber-600">Confirmed</p>
        </div>
        <div className="rounded-md bg-red-50 p-2">
          <p className="text-lg font-bold text-red-600">{loading ? "—" : summary.alerted}</p>
          <p className="text-xs text-red-600">Alerted</p>
        </div>
      </div>

      {/* Detection list */}
      <div className="max-h-[200px] space-y-2 overflow-y-auto">
        {loading && (
          <p className="py-4 text-center text-xs text-slate-400">Loading detections…</p>
        )}
        {error && (
          <p className="py-4 text-center text-xs text-red-500">{error}</p>
        )}
        {!loading && !error && detections.map((d) => {
          const badge = statusBadge(d.status);
          return (
            <div key={d.id} className={`rounded-md border p-2 transition-all ${rowBg(d.status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{d.vehicle_id}</p>
                    {d.status === "alerted" || d.status === "confirmed"
                      ? <AlertCircle className="h-3 w-3 text-red-600" />
                      : <Clock className="h-3 w-3 animate-spin text-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-600 truncate max-w-[180px]" title={d.location}>
                    {d.location.split(",")[0]}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>📷 {d.camera_id}</span>
                    <span>⏱ {d.duration}min</span>
                    {d.confidence && <span>🎯 {(d.confidence * 100).toFixed(0)}%</span>}
                  </div>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">AI Detection:</span> YOLOv11 + ByteTrack tracking vehicles in no-parking zones
          {stats ? ` across ${stats.cameras_online} cameras` : ""}. Data refreshes every 30s.
        </p>
      </div>
    </div>
  );
}
