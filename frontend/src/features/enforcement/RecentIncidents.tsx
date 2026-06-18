import { Clock, MapPin, User, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";

const fallbackTimeline = [
  {
    action: "OFFICER_ASSIGNED",
    title: "Unit TP-12 assigned to KR Market",
    description: "Nearest patrol moved from JC Road to clear repeat parking buildup.",
    timestamp: "2 min ago",
  },
  {
    action: "ACKNOWLEDGED",
    title: "Alert acknowledged at MG Road",
    description: "Supervisor confirmed obstruction near bus bay and escalated priority.",
    timestamp: "6 min ago",
  },
  {
    action: "RESOLVED",
    title: "Tow support completed on Brigade Road",
    description: "Two blocking vehicles cleared and lane restored for normal flow.",
    timestamp: "14 min ago",
  },
];

export default function RecentIncidents() {
  const { data: timeline } = useQuery({
    queryKey: ["enforcement-timeline"],
    queryFn: async () => {
      const res = await api.get("/enforcement/timeline");
      return res.data.slice(0, 8); // Show recent 8 events
    },
    refetchInterval: 120000,
  });

  const activityFeed = timeline?.length ? timeline.slice(0, 5) : fallbackTimeline;

  const getActionIcon = (action: string) => {
    switch (action) {
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "OFFICER_ASSIGNED":
        return <User className="h-4 w-4 text-blue-600" />;
      case "ACKNOWLEDGED":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <MapPin className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-600" />
          <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
        </div>
        <p className="mt-1 text-xs text-slate-500">Latest dispatch, acknowledgement, and resolution updates.</p>
      </div>

      <div className="max-h-[360px] overflow-y-auto p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-slate-200" />

          <div className="space-y-4">
            {activityFeed.map((event: any, idx: number) => (
              <div key={idx} className="relative flex gap-3">
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow">
                    {getActionIcon(event.action)}
                  </div>
                </div>

                {/* Event content */}
                <div className="flex-1 pb-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
                    <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{event.description}</p>
                    <p className="text-xs text-slate-400 mt-2">{event.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-lg font-bold text-slate-900">{activityFeed.length}</p>
            <p className="text-[11px] text-slate-500">Visible Updates</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-lg font-bold text-green-600">
              {activityFeed.filter((event: any) => event.action === "RESOLVED").length}
            </p>
            <p className="text-[11px] text-slate-500">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}
