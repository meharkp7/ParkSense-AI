import DashboardLayout from "@/layouts/DashboardLayout";
import EnforcementStats from "@/features/enforcement/EnforcementStats";
import EnhancedAlertQueue from "@/features/enforcement/EnhancedAlertQueue";
import LiveOfficerMap from "@/features/enforcement/LiveOfficerMap";
import QuickActions from "@/features/enforcement/QuickActions";
import EnforcementMetrics from "@/features/enforcement/EnforcementMetrics";
import RecentIncidents from "@/features/enforcement/RecentIncidents";

export default function Enforcement() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header with Quick Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Enforcement Command Center
            </h1>
            <p className="text-sm text-slate-500">
              Real-time incident management & field coordination
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Top Stats - Enhanced */}
        <EnforcementStats />

        {/* Main Content Grid - Alert queue kept denser, ops widgets stay compact */}
        <div className="grid gap-4 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <EnhancedAlertQueue />
          </div>

          <div className="xl:col-span-4">
            <LiveOfficerMap />
          </div>

          <div className="xl:col-span-3">
            <RecentIncidents />
          </div>
        </div>

        {/* Bottom: Metrics */}
        <EnforcementMetrics />
      </div>
    </DashboardLayout>
  );
}
