export default function MapLegend() {
  return (
    <div
      className="
        flex flex-wrap gap-4
        rounded-2xl
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        p-4
        shadow-sm
      "
    >
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-red-600" />
        <span className="text-sm text-slate-600">
          Critical (&gt;20k violations)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-amber-500" />
        <span className="text-sm text-slate-600">
          Medium (10k–20k)
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-green-600" />
        <span className="text-sm text-slate-600">
          Low Risk
        </span>
      </div>
    </div>
  );
}