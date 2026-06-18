import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import { Clock, CheckCircle, UserPlus, AlertCircle, MessageSquare } from "lucide-react";

export default function EnforcementTimeline() {
  const { data: timeline } = useQuery({
    queryKey: ["enforcement-timeline"],
    queryFn: async () => {
      const res = await api.get("/enforcement/timeline");
      return res.data;
    },
    refetchInterval: 10000,
  });

  const getIcon = (action: string) => {
    switch (action) {
      case "NEW_ALERT":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "ACKNOWLEDGED":
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      case "OFFICER_ASSIGNED":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "SMS_SENT":
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-600" />
        <h3 className="text-sm font-semibold text-slate-700">Activity Timeline</h3>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {timeline?.map((event: any, idx: number) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-slate-100 p-2">
                  {getIcon(event.action)}
                </div>
                {idx < timeline.length - 1 && (
                  <div className="h-full w-0.5 bg-slate-200 my-1" />
                )}
              </div>

              <div className="flex-1 pb-3">
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-600">{event.description}</p>
                <p className="mt-1 text-xs text-slate-500">{event.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
