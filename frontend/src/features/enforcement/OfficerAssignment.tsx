const officers = [
  {
    name: "Officer A12",
    zone: "KR Market",
    eta: "7 min",
  },

  {
    name: "Officer B07",
    zone: "Majestic",
    eta: "5 min",
  },

  {
    name: "Officer C19",
    zone: "Gandhi Nagar",
    eta: "9 min",
  },
];

export default function OfficerAssignment() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700">Officer Assignment</h3>
      <div className="mt-3 space-y-2">
        {officers.map((officer) => (
          <div key={officer.name} className="rounded-md bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{officer.name}</p>
            <p className="text-xs text-slate-500">
              {officer.zone} • ETA {officer.eta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
