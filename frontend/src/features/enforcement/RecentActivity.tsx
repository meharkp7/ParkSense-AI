export default function RecentActivity() {
  const activities = [
    {
      time: "23:01",
      event: "Officer A12 dispatched",
    },
    {
      time: "22:58",
      event: "Tow vehicle deployed",
    },
    {
      time: "22:54",
      event: "Critical alert generated",
    },
    {
      time: "22:48",
      event: "Congestion threshold crossed",
    },
    {
      time: "22:40",
      event: "Alert resolved",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Recent Activity
      </h2>

      <p className="mb-5 text-sm text-slate-500">
        Enforcement operations feed
      </p>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.time}
            className="flex gap-3"
          >
            <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />

            <div>
              <p className="text-xs text-slate-400">
                {item.time}
              </p>

              <p className="text-sm text-slate-700">
                {item.event}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}