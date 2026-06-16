import KPICard from "./KPICard";

export default function KPIGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <KPICard
        title="Total Violations"
        value={298450}
      />

      <KPICard
        title="Detected Hotspots"
        value={606}
      />

      <KPICard
        title="Average PCI"
        value={68}
        suffix="%"
      />

      <KPICard
        title="High Risk Zones"
        value={84}
      />
    </div>
  );
}