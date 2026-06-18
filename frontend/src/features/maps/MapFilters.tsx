interface MapFiltersProps {
  search: string;
  setSearch: (value: string) => void;

  severity: string;
  setSeverity: (value: string) => void;
}

export default function MapFilters({
  search,
  setSearch,
  severity,
  setSeverity,
}: MapFiltersProps) {
  return (
    <div
      className="
        flex flex-col gap-4
        rounded-2xl
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        p-4
        shadow-sm
        md:flex-row
      "
    >
      <input
        type="text"
        placeholder="Search hotspot ID..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          flex-1
          rounded-xl
          border border-slate-200
          px-4 py-2
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />

      <select
        value={severity}
        onChange={(e) =>
          setSeverity(e.target.value)
        }
        className="
          rounded-xl
          border border-slate-200
          px-4 py-2
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      >
        <option value="all">
          All Severity
        </option>

        <option value="critical">
          Critical
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="low">
          Low
        </option>
      </select>
    </div>
  );
}