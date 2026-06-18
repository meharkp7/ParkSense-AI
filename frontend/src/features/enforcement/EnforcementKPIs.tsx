import { useAlerts } from "@/hooks/useAlerts";

export default function EnforcementKPIs() {
  const { data } = useAlerts();

  if (!data) return null;

  const active = data.length;
  const critical = data.filter((a: any) => a.severity === "CRITICAL").length;
  const warnings = data.filter((a: any) => a.severity === "HIGH").length;
  const estimatedUnits = Math.max(1, Math.ceil(critical * 1.5));

  const cards = [
    {
      title: "Active Alerts",
      value: active,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      title: "Critical",
      value: critical,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      title: "Warnings",
      value: warnings,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      title: "Tow Units",
      value: estimatedUnits,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-lg border ${card.border} ${card.bg} p-4 shadow-sm`}
        >
          <p className="text-xs font-semibold text-slate-600">
            {card.title}
          </p>
          <p className={`mt-1 text-2xl font-bold ${card.color}`}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}