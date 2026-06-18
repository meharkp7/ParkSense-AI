import { Users, Car, Camera, Bell } from "lucide-react";

export default function QuickStats() {
  const stats = [
    { icon: Users, label: "Officers", value: "24", status: "Active", tone: "bg-blue-50 text-blue-700" },
    { icon: Car, label: "Patrols", value: "12", status: "On Duty", tone: "bg-emerald-50 text-emerald-700" },
    { icon: Camera, label: "Cameras", value: "156", status: "Online", tone: "bg-violet-50 text-violet-700" },
    { icon: Bell, label: "Alerts", value: "8", status: "Pending", tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Stats</h3>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-slate-50 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-lg p-2 ${stat.tone}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[11px] font-medium text-slate-500">{stat.status}</span>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
