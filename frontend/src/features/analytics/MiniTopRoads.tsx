import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

export default function MiniTopRoads() {
  const { data } = useQuery({
    queryKey: ["top-roads"],
    queryFn: async () => {
      const res = await api.get("/analytics/top-roads");
      return res.data.slice(0, 5);
    },
  });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-orange-600" />
        <h3 className="text-sm font-semibold text-slate-700">Top Congested Roads</h3>
      </div>

      <div className="space-y-2">
        {data?.map((road: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between rounded-md bg-slate-50 p-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs font-semibold text-slate-900">{road.location}</p>
                <p className="text-xs text-slate-500">{road.violations} violations</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-orange-600">
                {Math.round(road.pci * 100)}%
              </p>
              <p className="text-xs text-slate-500">PCI</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
