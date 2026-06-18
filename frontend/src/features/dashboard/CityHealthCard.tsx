import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function CityHealthCard() {
  const { data } = useQuery({
    queryKey: ["city-health"],

    queryFn: async () => {
      const res = await api.get(
        "/city-health"
      );

      return res.data;
    },

    refetchInterval: 120000,
  });

  if (!data) return null;

  const progress = data.score;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            City Health Score
          </p>

          <h2 className="mt-2 text-5xl font-bold text-slate-900">
            {data.score}
            <span className="ml-2 text-2xl font-medium text-slate-400">
              /100
            </span>
          </h2>

          <div
            className={`
              mt-4 inline-flex rounded-full px-4 py-1 text-sm font-semibold
              ${
                data.color === "green"
                  ? "bg-green-100 text-green-700"
                  : data.color === "yellow"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {data.status}
          </div>
        </div>

        {/* Circular indicator */}
        <div className="relative h-28 w-28">
          <svg
            className="h-28 w-28 -rotate-90"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="none"
            />

            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={
                data.color === "green"
                  ? "#22C55E"
                  : data.color === "yellow"
                  ? "#F59E0B"
                  : "#EF4444"
              }
              strokeWidth="10"
              fill="none"
              strokeDasharray={314}
              strokeDashoffset={
                314 - (314 * progress) / 100
              }
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">
              {data.score}
            </span>
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm text-slate-500">
          <span>City Stability</span>
          <span>{data.score}%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-200">
          <div
            className={`
              h-3 rounded-full transition-all duration-700
              ${
                data.color === "green"
                  ? "bg-green-500"
                  : data.color === "yellow"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }
            `}
            style={{
              width: `${data.score}%`,
            }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Average PCI
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(data.avg_pci * 100).toFixed(1)}%
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Violations
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {data.violations.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">
          Updated in real time
        </span>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          LIVE MONITORING
        </span>
      </div>
    </div>
  );
}
