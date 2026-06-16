import KPICard from "./KPICard";

import { useKPIs } from "@/hooks/useKPIs";

export default function KPIGrid() {
  const {
    data,
    isLoading,
    isError,
  } = useKPIs();

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="
              h-32
              animate-pulse
              rounded-2xl
              bg-slate-100
            "
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        Failed to load dashboard metrics.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Total Violations"
        value={data.total_violations}
      />

      <KPICard
        title="Detected Hotspots"
        value={data.hotspots}
      />

      <KPICard
        title="Average PCI"
        value={Math.round(
          data.avg_pci * 100
        )}
        suffix="%"
      />

      <KPICard
        title="High Risk Zones"
        value={data.high_risk_zones}
      />
    </div>
  );
}