import { useTopHotspots } from "@/hooks/useTopHotspots";

function getSeverity(
  violations: number,
) {
  if (violations >= 30000) {
    return {
      priority: "P1",
      level: "CRITICAL",
      badge:
        "bg-red-100 text-red-700 border-red-200",
      icon: "🔴",
      message:
        "Immediate intervention required",
    };
  }

  if (violations >= 10000) {
    return {
      priority: "P2",
      level: "HIGH",
      badge:
        "bg-orange-100 text-orange-700 border-orange-200",
      icon: "🟠",
      message:
        "Deploy additional patrols",
    };
  }

  return {
    priority: "P3",
    level: "MEDIUM",
    badge:
      "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "🟡",
    message:
      "Monitor congestion closely",
  };
}

export default function TopHotspots() {
  const {
    data,
    isLoading,
  } = useTopHotspots();

  if (isLoading) {
    return (
      <div className="h-[500px] animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (!data) return null;

  return (
    <div
        className="
            h-[620px]
            rounded-2xl
            border border-slate-200
            bg-white
            p-6
            shadow-sm
            flex
            flex-col
        "
        >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Critical Zones
        </h2>

        <p className="text-sm text-slate-500">
          Enforcement priority queue
        </p>
      </div>

      <div
        className="
            space-y-4
            max-h-[600px]
            overflow-y-auto
            pr-2
            scrollbar-thin
            scrollbar-thumb-slate-300
            scrollbar-track-transparent
        "
        >
        {data.map(
          (
            hotspot: any,
            index: number,
          ) => {
            const severity =
              getSeverity(
                hotspot.violations
              );

            return (
              <div
                key={index}
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  p-5
                  transition-all
                  duration-300
                  hover:shadow-lg
                  hover:-translate-y-1
                "
              >
                {/* Top Row */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        border
                        font-bold
                        ${severity.badge}
                      `}
                    >
                      {severity.priority}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Hotspot #
                        {hotspot.hotspot_id}
                      </h3>

                      <p className="text-sm text-slate-500">
                        {hotspot.unique_locations} roads monitored
                      </p>
                    </div>
                  </div>

                  <span
                    className={`
                      rounded-full
                      border
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      ${severity.badge}
                    `}
                  >
                    {severity.icon} {severity.level}
                  </span>
                </div>

                {/* Main Metric */}
                <div className="mb-3">
                  <div className="text-3xl font-bold text-red-600">
                    {hotspot.violations.toLocaleString()}
                  </div>

                  <div className="text-sm text-slate-500">
                    parking violations detected
                  </div>
                </div>

                {/* Status Message */}
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-sm text-slate-700">
                    {severity.message}
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}