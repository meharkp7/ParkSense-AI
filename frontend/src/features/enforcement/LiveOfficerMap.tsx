import { MapPin, Navigation, Phone, MessageSquare } from "lucide-react";

export default function LiveOfficerMap() {
  const officers = [
    {
      id: 1,
      name: "Officer Kumar",
      badge: "TP-1234",
      location: "MG Road",
      lat: 12.9716,
      lng: 77.5946,
      status: "On Duty",
      cases: 3,
      available: false,
      lastUpdate: "2m ago",
    },
    {
      id: 2,
      name: "Officer Sharma",
      badge: "TP-5678",
      location: "Indiranagar",
      lat: 12.9716,
      lng: 77.5946,
      status: "Available",
      cases: 1,
      available: true,
      lastUpdate: "1m ago",
    },
    {
      id: 3,
      name: "Officer Patel",
      badge: "TP-9012",
      location: "Koramangala",
      lat: 12.9352,
      lng: 77.6245,
      status: "On Duty",
      cases: 2,
      available: false,
      lastUpdate: "5m ago",
    },
    {
      id: 4,
      name: "Officer Singh",
      badge: "TP-3456",
      location: "Whitefield",
      lat: 12.9698,
      lng: 77.7500,
      status: "Break",
      cases: 0,
      available: false,
      lastUpdate: "3m ago",
    },
    {
      id: 5,
      name: "Officer Reddy",
      badge: "TP-7890",
      location: "KR Market",
      lat: 12.9591,
      lng: 77.5821,
      status: "On Duty",
      cases: 4,
      available: false,
      lastUpdate: "Just now",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500";
      case "On Duty":
        return "bg-blue-500";
      case "Break":
        return "bg-yellow-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Live Officer Tracking</h3>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-emerald-700">{officers.filter(o => o.available).length} Available</span>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
            <p className="text-lg font-bold text-slate-900">{officers.length}</p>
            <p className="text-[11px] text-slate-500">Total Units</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
            <p className="text-lg font-bold text-blue-600">{officers.filter((o) => o.status === "On Duty").length}</p>
            <p className="text-[11px] text-slate-500">On Duty</p>
          </div>
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
            <p className="text-lg font-bold text-orange-600">{officers.reduce((sum, o) => sum + o.cases, 0)}</p>
            <p className="text-[11px] text-slate-500">Active Cases</p>
          </div>
        </div>
      </div>

      {/* Officer List */}
      <div className="max-h-[360px] overflow-y-auto p-4">
        <div className="space-y-3">
          {officers.slice(0, 4).map((officer) => (
            <div
              key={officer.id}
              className="rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-3 transition-all hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white">
                      {officer.name.split(" ")[1][0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(officer.status)}`} />
                  </div>
                  
                  <div>
                    <p className="text-sm font-bold text-slate-900">{officer.name}</p>
                    <p className="text-xs text-slate-500">{officer.badge}</p>
                  </div>
                </div>

                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  officer.available ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {officer.status}
                </span>
              </div>

              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {officer.location}
                </span>
                <span>•</span>
                <span>{officer.cases} active cases</span>
                <span>•</span>
                <span className="text-slate-400">{officer.lastUpdate}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition-colors">
                  <Phone className="h-3 w-3" />
                  Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 rounded-md bg-purple-100 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-200 transition-colors">
                  <MessageSquare className="h-3 w-3" />
                  SMS
                </button>
                <button className="flex items-center justify-center gap-1 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                  <Navigation className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Coverage</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {["CBD", "East Zone", "South Zone"].map((zone) => (
            <span key={zone} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              {zone}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
