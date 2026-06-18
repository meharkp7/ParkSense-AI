import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { api } from "@/services/api/client";
import { useTimeline } from "@/hooks/useTimeline";
import {
  useLocation,
} from "@/context/LocationContext";
import {
  useEffect,
} from "react";

export default function PredictionPanel() {
  const [selected, setSelected] = useState(0);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["predictions"],

    queryFn: async () => {
      const res = await api.get(
        "/predictions"
      );

      return res.data;
    },
  });

  // ALWAYS call hooks before returns
  const current =
    data?.[selected];

  const {
    data: timeline,
  } = useTimeline(
    current?.location || ""
  );

  const {
    selectedLocation,
  } = useLocation();
  useEffect(() => {
    if (
        selectedLocation &&
        data
    ) {
        const idx =
        data.findIndex(
            (item: any) =>
            item.location ===
            selectedLocation
        );

        if (idx !== -1) {
        setSelected(idx);
        }
    }
    }, [
    selectedLocation,
    data,
    ]);

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        Loading predictions...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
        Failed to load predictions.
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            City Operations Forecast
          </h2>

          <p className="text-slate-500">
            Dynamic congestion intelligence
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
          ● LIVE
        </div>
      </div>

      {/* Region Selector */}
      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Select Region
        </label>

        <select
          value={selected}
          onChange={(e) =>
            setSelected(
              Number(
                e.target.value
              )
            )
          }
          className="
            w-full
            rounded-2xl
            border
            border-slate-200
            p-3
            text-slate-900
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        >
          {data.map(
            (
              item: any,
              index: number
            ) => (
              <option
                key={index}
                value={index}
              >
                {item.display_name}
              </option>
            )
          )}
        </select>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          title="Peak Hour"
          value={
            current.peak_hour
          }
        />

        <MetricCard
          title="PCI"
          value={`${(
            current.predicted_pci *
            100
          ).toFixed(1)}%`}
          color="text-red-600"
        />

        <MetricCard
          title="Violations"
          value={current.violations.toLocaleString()}
        />

        <MetricCard
          title="Risk"
          value={
            current.risk
          }
          color={
            current.risk ===
            "CRITICAL"
              ? "text-red-600"
              : current.risk ===
                "HIGH"
              ? "text-orange-600"
              : current.risk ===
                "MEDIUM"
              ? "text-yellow-600"
              : "text-green-600"
          }
        />
      </div>

      {/* Timeline */}
      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Hourly Congestion Trend
            </h3>

            <p className="text-sm text-slate-500">
              Real PCI variation
              across 24 hours
            </p>
          </div>

          <div className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-600">
            Peak:{" "}
            {
              current.peak_hour
            }
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={
                timeline || []
              }
            >
              <defs>
                <linearGradient
                  id="pci"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#ef4444"
                    stopOpacity={0.8}
                  />

                  <stop
                    offset="95%"
                    stopColor="#ef4444"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="hour"
              />

              <YAxis
                domain={[
                  0,
                  1,
                ]}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="pci"
                stroke="#ef4444"
                fillOpacity={1}
                fill="url(#pci)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-8 rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 p-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          AI Recommendation
        </p>

        <p className="mt-3 text-lg text-slate-800">
          {
            current.recommended_action
          }
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color = "text-slate-900",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p
        className={`mt-3 text-3xl font-bold ${color}`}
      >
        {value}
      </p>
    </div>
  );
}