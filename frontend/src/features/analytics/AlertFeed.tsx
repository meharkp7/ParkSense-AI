import { useAlerts } from "@/hooks/useAlerts";

export default function AlertFeed() {
  const { data } = useAlerts();

  if (!data) return null;

  const alerts = [...data, ...data]; // duplicate for smooth loop

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-red-600 to-orange-600 p-4 shadow-sm overflow-hidden">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

        <h2 className="text-lg font-semibold text-white">
          Live City Events
        </h2>
      </div>

      <div className="overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-8">
          {alerts.map((alert: any, index: number) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-white/20 backdrop-blur-sm
                px-4
                py-2
                text-white
                shrink-0
              "
            >
              <span className="text-red-400">🚨</span>

              <span className="text-sm">
                {alert.message}
              </span>

              <span className="text-xs text-slate-400">
                {alert.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}