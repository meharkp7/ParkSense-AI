import { useState } from "react";
import { Activity, AlertTriangle, MapPinned, ShieldCheck } from "lucide-react";

import DashboardLayout from "@/layouts/DashboardLayout";
import MapView from "@/features/maps/MapView";
import MapLegend from "@/features/maps/MapLegend";
import MapFilters from "@/features/maps/MapFilters";
import { useHotspots } from "@/hooks/useHotspots";

export default function LiveMap() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] =
    useState("all");
  const { data: hotspots } = useHotspots();

  const criticalCount =
    hotspots?.filter((spot: any) => spot.violations > 20000).length || 0;
  const mediumCount =
    hotspots?.filter((spot: any) => spot.violations > 10000 && spot.violations <= 20000).length || 0;
  const topHotspot = hotspots?.[0];
  const totalViolations =
    hotspots?.reduce((sum: number, spot: any) => sum + spot.violations, 0) || 0;

  const mapHighlights = [
    {
      label: "Tracked Hotspots",
      value: hotspots?.length || 0,
      hint: "live clusters",
      icon: MapPinned,
      tone: "text-blue-600 bg-blue-50",
    },
    {
      label: "Critical Zones",
      value: criticalCount,
      hint: "need patrol focus",
      icon: AlertTriangle,
      tone: "text-red-600 bg-red-50",
    },
    {
      label: "Medium Pressure",
      value: mediumCount,
      hint: "watch closely",
      icon: Activity,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Violations Indexed",
      value: totalViolations.toLocaleString(),
      hint: "citywide load",
      icon: ShieldCheck,
      tone: "text-emerald-600 bg-emerald-50",
    },
  ];

  const mapDetailStats = [
    {
      label: "Deployment Focus",
      value: topHotspot?.top_location || topHotspot?.location || "Bengaluru Core",
      hint: "highest current load cluster",
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Priority",
      value: criticalCount > 0 ? "Immediate Patrol" : "Routine Monitoring",
      hint: `${criticalCount} critical zones flagged`,
      tone: "bg-red-50 text-red-700",
    },
    {
      label: "Zone Coverage",
      value: `${topHotspot?.unique_locations || 0} roads`,
      hint: "within top hotspot cluster",
      tone: "bg-slate-100 text-slate-800",
    },
    {
      label: "Operational Load",
      value: `${mediumCount + criticalCount} active watch zones`,
      hint: "critical + medium monitoring",
      tone: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Live Parking Intelligence Map
          </h1>

          <p className="mt-2 text-slate-500">
            Real-time hotspot monitoring
            across Bengaluru
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-4">
          {mapHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
                  </div>
                  <div className={`rounded-xl p-2 ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <MapLegend />

        <MapFilters
          search={search}
          setSearch={setSearch}
          severity={severity}
          setSeverity={setSeverity}
        />

        <MapView
          search={search}
          severity={severity}
        />

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
          {mapDetailStats.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur-md"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>
              <div className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.tone}`}>
                {item.hint}
              </div>
              <p className="mt-3 text-lg font-bold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
