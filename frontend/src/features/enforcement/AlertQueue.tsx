import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import {
  AlertCircle,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Phone,
  CheckCheck,
} from "lucide-react";

interface Alert {
  id: string;
  location: string;
  vehicle_id: string;
  severity: string;
  timestamp: string;
  status: "NEW" | "ACKNOWLEDGED" | "OFFICER_ASSIGNED" | "RESOLVED";
  officer?: string;
  notes?: string;
}

export default function AlertQueue() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [officerName, setOfficerName] = useState("");
  const [smsMessage, setSmsMessage] = useState("");

  const { data: alerts } = useQuery({
    queryKey: ["alert-queue"],
    queryFn: async () => {
      const res = await api.get("/alerts/queue");
      return res.data;
    },
    refetchInterval: 120000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return api.post(`/alerts/${alertId}/acknowledge`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
    },
  });

  const assignOfficerMutation = useMutation({
    mutationFn: async ({ alertId, officer }: { alertId: string; officer: string }) => {
      return api.post(`/alerts/${alertId}/assign`, { officer });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setOfficerName("");
    },
  });

  const sendSMSMutation = useMutation({
    mutationFn: async ({ alertId, message }: { alertId: string; message: string }) => {
      return api.post(`/alerts/${alertId}/sms`, { message });
    },
    onSuccess: () => {
      setSmsMessage("");
      alert("SMS sent successfully!");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return api.post(`/alerts/${alertId}/resolve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setSelectedAlert(null);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" };
      case "ACKNOWLEDGED":
        return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" };
      case "OFFICER_ASSIGNED":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "RESOLVED":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      default:
        return { bg: "bg-slate-100", text: "text-slate-700", border: "border-slate-200" };
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <h3 className="text-sm font-semibold text-slate-700">Alert Queue</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-red-100 px-2 py-0.5 font-semibold text-red-700">
            {alerts?.filter((a: Alert) => a.status === "NEW").length || 0} New
          </span>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 font-semibold text-yellow-700">
            {alerts?.filter((a: Alert) => a.status === "ACKNOWLEDGED").length || 0} Acknowledged
          </span>
          <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold text-blue-700">
            {alerts?.filter((a: Alert) => a.status === "OFFICER_ASSIGNED").length || 0} Assigned
          </span>
        </div>
      </div>

      <div className="grid gap-2 max-h-96 overflow-y-auto">
        {alerts?.map((alert: Alert) => {
          const colors = getStatusColor(alert.status);
          const isSelected = selectedAlert?.id === alert.id;

          return (
            <div
              key={alert.id}
              className={`rounded-lg border ${colors.border} ${colors.bg} p-3 transition-all cursor-pointer ${
                isSelected ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-slate-900">{alert.location}</p>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${colors.text}`}>
                      {alert.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700">Vehicle: {alert.vehicle_id}</p>
                  <p className="text-xs text-slate-500">{alert.timestamp}</p>
                  {alert.officer && (
                    <p className="mt-1 text-xs font-semibold text-blue-700">
                      👮 Officer: {alert.officer}
                    </p>
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 space-y-2 border-t border-slate-300 pt-3">
                  {/* Workflow Actions */}
                  {alert.status === "NEW" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        acknowledgeMutation.mutate(alert.id);
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Acknowledge
                    </button>
                  )}

                  {alert.status === "ACKNOWLEDGED" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Officer name..."
                          value={officerName}
                          onChange={(e) => setOfficerName(e.target.value)}
                          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (officerName) {
                              assignOfficerMutation.mutate({ alertId: alert.id, officer: officerName });
                            }
                          }}
                          className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign
                        </button>
                      </div>
                    </div>
                  )}

                  {alert.status === "OFFICER_ASSIGNED" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSmsMessage(
                              `BBMP Alert: Illegal parking detected at ${alert.location}. Vehicle: ${alert.vehicle_id}. Please move immediately or face penalties.`
                            );
                          }}
                          className="flex items-center justify-center gap-2 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                          <MessageSquare className="h-4 w-4" />
                          SMS
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.alert(`Calling officer: ${alert.officer}`);
                          }}
                          className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4" />
                          Call
                        </button>
                      </div>

                      {smsMessage && (
                        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            value={smsMessage}
                            onChange={(e) => setSmsMessage(e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            rows={3}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              sendSMSMutation.mutate({ alertId: alert.id, message: smsMessage });
                            }}
                            className="w-full rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                          >
                            Send SMS
                          </button>
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resolveMutation.mutate(alert.id);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        <CheckCheck className="h-4 w-4" />
                        Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
