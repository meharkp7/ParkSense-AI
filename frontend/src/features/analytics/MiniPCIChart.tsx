import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function MiniPCIChart() {
  const { data } = useQuery({
    queryKey: ["pci-trend"],
    queryFn: async () => {
      const res = await api.get("/analytics/pci-trend");
      return res.data;
    },
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">PCI Trend</h3>
        </div>
        <span className="text-xs text-slate-500">Last 24h</span>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data || []}>
            <defs>
              <linearGradient id="pciGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              stroke="#94A3B8"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="pci"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#pciGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
