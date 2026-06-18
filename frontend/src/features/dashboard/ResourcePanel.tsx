import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function ResourcePanel() {
  const { data } = useQuery({
    queryKey: ["resources"],

    queryFn: async () => {
      const res =
        await api.get(
          "/resources"
        );

      return res.data;
    },

    refetchInterval:
      30000,
  });

  if (!data) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Resource Deployment
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        AI-recommended field allocation
      </p>

      <div className="mt-5 space-y-3">
        <Metric
          icon="🚚"
          label="Tow Units"
          value={data.tow_units}
        />

        <Metric
          icon="👮"
          label="Officers"
          value={data.officers}
        />

        <Metric
          icon="⏱"
          label="Clearance"
          value={`${data.clearance_time} min`}
        />
      </div>

      <div className="mt-5 rounded-xl bg-blue-50 p-3">
        <p className="text-xs text-blue-600">
          Priority Zone
        </p>

        <p className="font-semibold text-slate-900">
          {data.location.split(",")[0]}
        </p>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-slate-900">
      <span className="text-slate-700">
        {icon} {label}
      </span>

      <span className="font-bold text-slate-900">
        {value}
      </span>
    </div>
  );
}