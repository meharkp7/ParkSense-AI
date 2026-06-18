import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api/client";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function Analytics() {
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");

  const { data: report } = useQuery({
    queryKey: ["report", reportType],
    queryFn: async () => {
      const res = await api.get(`/reports/${reportType}`);
      return res.data;
    },
  });

  const { data: effectiveness } = useQuery({
    queryKey: ["effectiveness"],
    queryFn: async () => {
      const res = await api.get("/reports/enforcement-effectiveness");
      return res.data;
    },
  });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const downloadPDF = async () => {
    try {
      // Create a proper text-based report instead of corrupted PDF
      const reportText = `
PARKSENSE AI - ${reportType.toUpperCase()} REPORT
Generated: ${new Date().toLocaleString()}
====================================================

SUMMARY
-------
Total Violations: ${report?.summary.total_violations || 0}
Resolution Rate: ${report?.summary.resolution_rate || 0}%
Avg Response Time: ${report?.summary.avg_response_time || "N/A"}
Average PCI: ${report?.summary.avg_pci ? (report.summary.avg_pci * 100).toFixed(0) : 0}%
Hotspots Detected: ${report?.summary.hotspots_detected || 0}

TOP LOCATIONS
-------------
${report?.top_locations?.map((loc: any, idx: number) => 
  `${idx + 1}. ${loc.location} - ${loc.violations} violations (${loc.resolved} resolved)`
).join('\n') || 'No data'}

====================================================
This is a preview report. Full PDF export coming soon.
      `;

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `parksense_report_${reportType}_${new Date().toISOString().split("T")[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Analytics & Reports
            </h1>
            <p className="text-sm text-slate-500">
              Comprehensive enforcement analytics and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white">
              <Calendar className="ml-3 h-4 w-4 text-slate-500" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as "weekly" | "monthly")}
                className="rounded-lg border-0 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly Report</option>
                <option value="monthly">Monthly Report</option>
              </select>
            </div>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {report && (
          <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-blue-700">Total Violations</p>
                <p className="mt-2 text-3xl font-bold text-blue-900">
                  {report.summary.total_violations.toLocaleString()}
                </p>
                <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {report.summary.resolution_rate}% resolved
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-green-700">Resolution Rate</p>
                <p className="mt-2 text-3xl font-bold text-green-900">
                  {report.summary.resolution_rate}%
                </p>
                {reportType === "monthly" && report.trends && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {report.trends.resolution_trend}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-purple-700">Avg Response Time</p>
                <p className="mt-2 text-3xl font-bold text-purple-900">
                  {report.summary.avg_response_time}
                </p>
                {reportType === "monthly" && report.trends && (
                  <p className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                    <TrendingDown className="h-3 w-3" />
                    {report.trends.response_time_trend}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-slate-200 bg-gradient-to-br from-orange-50 to-orange-100 p-5 shadow-sm">
                <p className="text-sm font-semibold text-orange-700">Average PCI</p>
                <p className="mt-2 text-3xl font-bold text-orange-900">
                  {Math.round(report.summary.avg_pci * 100)}%
                </p>
                <p className="mt-2 text-xs text-orange-600">
                  {report.summary.hotspots_detected} hotspots
                </p>
              </div>
            </div>

            {/* Charts - Better Layout */}
            <div className="grid gap-4 lg:grid-cols-5">
              {/* Daily Breakdown - Takes 3 columns */}
              <div className="lg:col-span-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-slate-700">
                  Daily Breakdown
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={report.daily_breakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="violations" fill="#3B82F6" name="Violations" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" fill="#10B981" name="Resolved" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Locations - Takes 2 columns */}
              <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-base font-bold text-slate-700">
                  Top Violation Locations
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {report.top_locations.map((loc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{loc.location}</p>
                          <p className="text-xs text-green-600">{loc.resolved} resolved</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-900">
                        {loc.violations}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly-specific charts */}
            {reportType === "monthly" && report.top_violation_types && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-slate-700">
                    Violation Types Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={report.top_violation_types}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${Math.round((entry.percent || 0) * 100)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {report.top_violation_types.map((_: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="mb-4 text-base font-bold text-slate-700">
                    Officer Performance
                  </h3>
                  <div className="space-y-3 max-h-[280px] overflow-y-auto">
                    {report.officer_performance.map((officer: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {officer.officer}
                          </p>
                          <p className="text-xs text-slate-600">
                            {officer.cases_resolved} cases • {officer.avg_time} avg
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-yellow-600">
                            ⭐ {officer.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Enforcement Effectiveness */}
        {effectiveness && (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-700">
                Enforcement Effectiveness
              </h3>
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-bold text-blue-700">
                Score: {effectiveness.overall_score}/100
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(effectiveness.metrics).map(([key, metric]: [string, any]) => (
                <div key={key} className="rounded-lg bg-slate-50 p-4 border border-slate-200">
                  <p className="text-xs font-bold text-slate-700 uppercase">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {metric.current}
                  </p>
                  <div className="mt-3">
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${metric.achievement}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Target: {metric.target} • {metric.achievement}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
