import DashboardLayout from "@/layouts/DashboardLayout";
import CompactKPIGrid from "@/features/dashboard/components/CompactKPIGrid";
import CompactCityHealth from "@/features/dashboard/components/CompactCityHealth";
import PCIChart from "@/features/analytics/PCIChart";
import TopRoadsChart from "@/features/analytics/TopRoadsChart";
import MiniHotspots from "@/features/analytics/MiniHotspots";
import AlertFeed from "@/features/analytics/AlertFeed";
import CompactAIInsights from "@/features/analytics/CompactAIInsights";
import CompactPrediction from "@/features/prediction/CompactPrediction";
import CompactAnomaly from "@/features/ai/CompactAnomaly";
import LiveViolationDetection from "@/features/detection/LiveViolationDetection";
import AICopilot from "@/features/ai/AICopilot";
import QuickStats from "@/features/dashboard/components/QuickStats";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              ParkSense AI Command Center
            </h1>
            <p className="text-sm text-slate-500">
              Bengaluru Smart Parking Intelligence System
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-600" />
              LIVE
            </span>
          </div>
        </div>

        {/* Live Alert Banner - Orange Gradient */}
        <AlertFeed />

        {/* Compact KPIs - 6 metrics in single row */}
        <CompactKPIGrid />

        {/* Main Grid - balanced rows to avoid dead space */}
        <div className="grid gap-3 xl:auto-rows-fr xl:grid-cols-12">
          <div className="xl:col-span-4">
            <CompactCityHealth />
          </div>
          <div className="xl:col-span-4">
            <LiveViolationDetection />
          </div>
          <div className="xl:col-span-4">
            <CompactPrediction />
          </div>

          <div className="xl:col-span-3">
            <QuickStats />
          </div>
          <div className="xl:col-span-5">
            <MiniHotspots />
          </div>
          <div className="xl:col-span-4">
            <CompactAIInsights />
          </div>
        </div>

        {/* Second Row - Full Width Charts */}
        <div className="grid gap-3 lg:grid-cols-2">
          <PCIChart />
          <TopRoadsChart />
        </div>

        {/* Third Row - Advanced */}
        <div className="grid gap-3 lg:grid-cols-2">
          <CompactAnomaly />
          <AICopilot />
        </div>
      </div>
    </DashboardLayout>
  );
}
