import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/services/api/client";
import {
  AlertCircle,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Phone,
  CheckCheck,
  Clock,
  MapPin,
  Filter,
  Search,
} from "lucide-react";

export default function EnhancedAlertQueue() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const getErrorMessage = (error: unknown) => {
    const axiosError = error as AxiosError<{ detail?: string }>;
    return axiosError.response?.data?.detail || "Action failed. Check deployment configuration.";
  };

  const { data: alerts } = useQuery({
    queryKey: ["alert-queue"],
    queryFn: async () => {
      const res = await api.get("/enforcement/queue");
      return res.data;
    },
    refetchInterval: 5000,
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (alertId: string) => api.post(`/enforcement/${alertId}/acknowledge`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setActionMessage("Alert acknowledged and ready for officer assignment.");
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ alertId, officer }: { alertId: string; officer: string }) =>
      api.post(`/enforcement/${alertId}/assign`, { officer }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setActionMessage("Officer assigned successfully.");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: async (alertId: string) => api.post(`/enforcement/${alertId}/resolve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setSelectedAlert(null);
      setActionMessage("Alert marked as resolved.");
    },
  });

  const smsMutation = useMutation({
    mutationFn: async ({ alertId, message }: { alertId: string; message: string }) =>
      api.post(`/enforcement/${alertId}/sms`, { message }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setActionMessage(`SMS sent via ${response.data.provider} to ${response.data.phone_number}.`);
    },
    onError: (error) => {
      setActionMessage(getErrorMessage(error));
    },
  });

  const callMutation = useMutation({
    mutationFn: async ({ alertId, officerName }: { alertId: string; officerName?: string }) =>
      api.post(`/enforcement/${alertId}/call`, { officer_name: officerName }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["alert-queue"] });
      setActionMessage(`${response.data.officer} call logged for ${response.data.location}.`);
    },
    onError: (error) => {
      setActionMessage(getErrorMessage(error));
    },
  });

  const getStatusConfig = (status: string) => {
    const configs: any = {
      NEW: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
        badge: "bg-red-600",
        dot: "bg-red-500",
      },
      ACKNOWLEDGED: {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
        badge: "bg-yellow-600",
        dot: "bg-yellow-500",
      },
      OFFICER_ASSIGNED: {
        bg: "bg-blue-50",
        border: "border-blue-300",
        text: "text-blue-700",
        badge: "bg-blue-600",
        dot: "bg-blue-500",
      },
      RESOLVED: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
        badge: "bg-green-600",
        dot: "bg-green-500",
      },
    };
    return configs[status] || configs.NEW;
  };

  const filteredAlerts = alerts?.filter((alert: any) => {
    const matchesFilter = filterStatus === "all" || alert.status === filterStatus;
    const matchesSearch = alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: alerts?.length || 0,
    NEW: alerts?.filter((a: any) => a.status === "NEW").length || 0,
    ACKNOWLEDGED: alerts?.filter((a: any) => a.status === "ACKNOWLEDGED").length || 0,
    OFFICER_ASSIGNED: alerts?.filter((a: any) => a.status === "OFFICER_ASSIGNED").length || 0,
  };

  const visibleAlerts = filteredAlerts?.slice(0, 4) || [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header with Filters */}
      <div className="border-b border-slate-200 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-800">Alert Queue</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
              {statusCounts.NEW} New
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {statusCounts.all} Total
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by location or vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "NEW", "ACKNOWLEDGED", "OFFICER_ASSIGNED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
              <span className="ml-1.5">({statusCounts[status as keyof typeof statusCounts] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-[360px] overflow-y-auto p-4">
        {actionMessage && (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {actionMessage}
          </div>
        )}

        <div className="space-y-2">
          {visibleAlerts.map((alert: any) => {
            const config = getStatusConfig(alert.status);
            const isSelected = selectedAlert?.id === alert.id;

            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(isSelected ? null : alert)}
                className={`cursor-pointer rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-lg scale-[1.02]"
                    : `${config.border} hover:shadow-md`
                } ${config.bg} p-3`}
              >
                {/* Alert Header */}
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`h-2 w-2 rounded-full animate-pulse ${config.dot}`} />
                      <span className="text-sm font-bold text-slate-900">{alert.vehicle_id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold text-white ${config.badge}`}>
                        {alert.status.replace("_", " ")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className={`rounded-lg px-2 py-1 text-xs font-bold ${
                    alert.severity === "CRITICAL" ? "bg-red-600 text-white" :
                    alert.severity === "HIGH" ? "bg-orange-600 text-white" :
                    "bg-yellow-600 text-white"
                  }`}>
                    {alert.severity}
                  </div>
                </div>

                {/* Officer Info */}
                {alert.officer && (
                  <div className="mb-2 rounded-md bg-white p-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-blue-700">Officer: {alert.officer}</span>
                      <div className="flex flex-wrap gap-2 text-[11px]">
                        {alert.sms_sent_at && (
                          <span className="rounded-full bg-violet-100 px-2 py-0.5 font-semibold text-violet-700">
                            SMS sent
                          </span>
                        )}
                        {alert.call_status && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
                            Call logged
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions - Show when selected */}
                {isSelected && (
                  <div className={`mt-3 space-y-2 border-t pt-3 ${config.border}`}>
                    {alert.status === "NEW" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          acknowledgeMutation.mutate(alert.id);
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Acknowledge Alert
                      </button>
                    )}

                    {alert.status === "ACKNOWLEDGED" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const officer = prompt("Enter officer name:");
                            if (officer) assignMutation.mutate({ alertId: alert.id, officer });
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <UserPlus className="h-4 w-4" />
                          Assign
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const message = `BBMP Alert: Illegal parking detected at ${alert.location}. Vehicle ${alert.vehicle_id}. Please move immediately to avoid enforcement action.`;
                            smsMutation.mutate({ alertId: alert.id, message });
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {smsMutation.isPending ? "Sending..." : "SMS"}
                        </button>
                      </div>
                    )}

                    {alert.status === "OFFICER_ASSIGNED" && (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            callMutation.mutate({ alertId: alert.id, officerName: alert.officer });
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          <Phone className="h-4 w-4" />
                          {callMutation.isPending ? "Calling..." : "Call"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            resolveMutation.mutate(alert.id);
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          <CheckCheck className="h-4 w-4" />
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {visibleAlerts.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <Filter className="mx-auto mb-2 h-5 w-5 text-slate-400" />
              <p className="text-sm font-semibold text-slate-700">No alerts match this filter</p>
              <p className="mt-1 text-xs text-slate-500">
                Try switching status or clearing the search term.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-lg font-bold text-red-600">{statusCounts.NEW}</p>
            <p className="text-[11px] text-slate-500">Pending</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-lg font-bold text-yellow-600">{statusCounts.ACKNOWLEDGED}</p>
            <p className="text-[11px] text-slate-500">Acked</p>
          </div>
          <div className="rounded-lg bg-white px-3 py-2">
            <p className="text-lg font-bold text-blue-600">{statusCounts.OFFICER_ASSIGNED}</p>
            <p className="text-[11px] text-slate-500">Assigned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
