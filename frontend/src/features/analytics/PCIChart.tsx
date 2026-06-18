import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { usePCITrend } from "@/hooks/usePCITrend";

export default function PCIChart() {
  const {
    data,
    isLoading,
    isError,
  } = usePCITrend();

  if (isLoading) {
    return (
      <div className="h-[350px] animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        Failed to load PCI trend.
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        p-6
        shadow-sm
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Parking Congestion Index Trend
        </h2>

        <p className="text-sm text-slate-500">
          Hourly congestion across Bengaluru
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="pciGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563EB"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#2563EB"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="hour" />

            <YAxis
              domain={[0, 1]}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="avg_pci"
              stroke="#2563EB"
              fill="url(#pciGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}