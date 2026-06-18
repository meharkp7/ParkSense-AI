export default function ResourceStatus() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-bold text-slate-900 mb-3">
        Resource Deployment
      </h3>

      <div className="space-y-3">
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600">Tow Units</span>
            <span className="font-bold text-slate-900">4 / 6</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: "67%" }}
            />
          </div>
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-600">Officers</span>
            <span className="font-bold text-slate-900">12 / 16</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-green-600 transition-all"
              style={{ width: "75%" }}
            />
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-blue-50 p-3 border border-purple-200">
          <p className="text-xs font-semibold text-purple-700">Avg Response Time</p>
          <p className="mt-1 text-2xl font-bold text-purple-900">7 min</p>
        </div>
      </div>
    </div>
  );
}