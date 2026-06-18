import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function AnomalyPanel() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["anomalies"],

    queryFn: async () => {
      const res =
        await api.get(
          "/anomalies"
        );

      return res.data;
    },

    refetchInterval:
      30000,
  });

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading anomalies...
      </div>
    );
  }

  if (
    isError ||
    !data
  ) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
        Failed to load anomalies.
      </div>
    );
  }

  if (
    data.length === 0
  ) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          AI Anomaly Detection
        </h2>

        <p className="mt-3 text-slate-500">
          No anomalies detected.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            🚨 AI Anomaly Detection
          </h2>

          <p className="text-sm text-slate-500">
            Unusual traffic behavior across the city
          </p>
        </div>

        <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
          LIVE
        </div>
      </div>

      <div className="space-y-4">
        {data.map(
          (
            anomaly: any,
            index: number
          ) => (
            <div
              key={index}
              className="
                rounded-2xl
                border
                border-red-100
                bg-red-50
                p-4
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {
                      anomaly.location
                    }
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    {
                      anomaly.message
                    }
                  </p>
                </div>

                <div className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                  +
                  {
                    anomaly.increase
                  }
                  %
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-500">
                    Violations
                  </p>

                  <p className="text-lg font-bold text-slate-900">
                    {anomaly.violations.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl bg-white p-3">
                  <p className="text-xs text-slate-500">
                    Z-Score
                  </p>

                  <p className="text-lg font-bold text-red-600">
                    {anomaly.z_score}
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}