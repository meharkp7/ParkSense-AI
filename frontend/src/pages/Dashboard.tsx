import DashboardLayout from "@/layouts/DashboardLayout";
import KPIGrid from "@/features/dashboard/components/KPIGrid";
import MapView from "@/features/maps/MapView";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Bengaluru Parking Intelligence
          </h1>

          <p className="mt-2 text-slate-500">
            Predict • Prevent • Decongest
          </p>
        </div>

        <KPIGrid />

        <MapView />
      </div>
    </DashboardLayout>
  );
}