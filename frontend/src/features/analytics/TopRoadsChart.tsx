import { useTopRoads } from "@/hooks/useTopRoads";

export default function TopRoadsChart() {
  const { data, isLoading } = useTopRoads();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        Loading...
      </div>
    );
  }

  if (!data) return null;

  const maxPCI = Math.max(
    ...data.map((r: any) => r.avg_pci)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          Top Congested Roads
        </h2>

        <p className="text-sm text-slate-500">
          Highest Parking Congestion Index
        </p>
      </div>

      <div className="space-y-5">
        {data.slice(0, 5).map(
          (road: any, index: number) => (
            <div key={index}>
              <div className="mb-2 flex justify-between">
                <span className="max-w-[70%] truncate font-medium text-slate-700">
                  {road.location}
                </span>

                <span className="font-bold text-red-600">
                  {(road.avg_pci * 100).toFixed(1)}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-400 to-red-600 transition-all duration-700"
                  style={{
                    width: `${
                      (road.avg_pci / maxPCI) * 100
                    }%`,
                  }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {road.violations.toLocaleString()} violations
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}