import { useAlerts } from "@/hooks/useAlerts";

export default function AlertCards() {
  const { data } = useAlerts();

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Active Incidents
        </h2>

        <p className="text-sm text-slate-500">
          High-priority enforcement queue
        </p>
      </div>

      <div className="space-y-4">
        {data.slice(0, 8).map((alert: any, index: number) => (
          <div
            key={index}
            className="
              rounded-xl
              border
              border-red-100
              bg-red-50
              p-4
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                  CRITICAL
                </div>

                <h3 className="font-semibold text-slate-900">
                  {alert.location?.split(",")[0] ||
                    alert.message}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {alert.violations?.toLocaleString() ||
                    0} violations detected
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {alert.time}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm">
                Ack
              </button>

              <button className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white">
                Dispatch
              </button>

              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm">
                SMS
              </button>

              <button className="rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm">
                Call
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}