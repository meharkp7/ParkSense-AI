import { MapPin, Users } from "lucide-react";

export default function OfficerMap() {
  const officers = [
    { id: 1, name: "Officer Kumar", location: "MG Road", status: "On Duty", cases: 3 },
    { id: 2, name: "Officer Sharma", location: "Indiranagar", status: "Available", cases: 1 },
    { id: 3, name: "Officer Patel", location: "Koramangala", status: "On Duty", cases: 2 },
    { id: 4, name: "Officer Singh", location: "Whitefield", status: "Break", cases: 0 },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-4 w-4 text-green-600" />
        <h3 className="text-sm font-semibold text-slate-700">Field Officers</h3>
      </div>

      <div className="space-y-2">
        {officers.map((officer) => (
          <div
            key={officer.id}
            className="flex items-center justify-between rounded-md bg-slate-50 p-2"
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  officer.status === "On Duty"
                    ? "bg-green-500"
                    : officer.status === "Available"
                    ? "bg-blue-500"
                    : "bg-yellow-500"
                }`}
              />
              <div>
                <p className="text-xs font-semibold text-slate-900">{officer.name}</p>
                <div className="flex items-center gap-1 text-xs text-slate-600">
                  <MapPin className="h-3 w-3" />
                  <span>{officer.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900">{officer.cases}</p>
              <p className="text-xs text-slate-500">cases</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-2">
        <p className="text-xs text-green-700">
          <span className="font-semibold">24 officers</span> active • <span className="font-semibold">18 available</span> for assignment
        </p>
      </div>
    </div>
  );
}
