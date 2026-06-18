import { useState, useEffect } from "react";
import { Camera, AlertCircle, Clock, ShieldAlert, ScanLine } from "lucide-react";

interface Detection {
  id: string;
  vehicle_id: string;
  location: string;
  duration: number;
  status: "detecting" | "confirmed" | "alerted";
  timestamp: string;
  camera_id: string;
}

export default function LiveViolationDetection() {
  const [detections, setDetections] = useState<Detection[]>([
    {
      id: "1",
      vehicle_id: "KA01AB1234",
      location: "MG Road Junction",
      duration: 8,
      status: "confirmed",
      timestamp: new Date().toISOString(),
      camera_id: "CAM-001"
    },
    {
      id: "2",
      vehicle_id: "KA02CD5678",
      location: "Indiranagar Main",
      duration: 3,
      status: "detecting",
      timestamp: new Date().toISOString(),
      camera_id: "CAM-045"
    }
  ]);

  // Simulate live detection updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) =>
        prev.map((d) =>
          d.status === "detecting"
            ? { ...d, duration: d.duration + 1 }
            : d
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">
            Live Violation Detection
          </h3>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
          LIVE
        </span>
      </div>

      <div className="mb-3 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Detection Layer</p>
            <p className="mt-1 text-lg font-bold text-slate-900">YOLOv11 + ByteTrack</p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <ScanLine className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-red-700">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-blue-50 p-2">
          <p className="text-lg font-bold text-blue-600">12</p>
          <p className="text-xs text-blue-600">Detecting</p>
        </div>
        <div className="rounded-md bg-amber-50 p-2">
          <p className="text-lg font-bold text-amber-600">5</p>
          <p className="text-xs text-amber-600">Confirming</p>
        </div>
        <div className="rounded-md bg-red-50 p-2">
          <p className="text-lg font-bold text-red-600">3</p>
          <p className="text-xs text-red-600">Violations</p>
        </div>
      </div>

      <div className="space-y-2 max-h-[170px] overflow-y-auto">
        {detections.map((detection) => (
          <div
            key={detection.id}
            className={`
              rounded-md border p-2 transition-all
              ${
                detection.status === "confirmed"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
              }
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-slate-900">
                    {detection.vehicle_id}
                  </p>
                  {detection.status === "confirmed" ? (
                    <AlertCircle className="h-3 w-3 text-red-600" />
                  ) : (
                    <Clock className="h-3 w-3 animate-spin text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-slate-600">{detection.location}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <span>📷 {detection.camera_id}</span>
                  <span>⏱️ {detection.duration}min</span>
                </div>
              </div>
              <span
                className={`
                  rounded-full px-2 py-0.5 text-xs font-semibold
                  ${
                    detection.status === "confirmed"
                      ? "bg-red-200 text-red-700"
                      : "bg-blue-200 text-blue-700"
                  }
                `}
              >
                {detection.status === "confirmed" ? "VIOLATION" : "TRACKING"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">AI Detection:</span> YOLOv11 + ByteTrack tracking vehicles in no-parking zones across 156 cameras
        </p>
      </div>
    </div>
  );
}
