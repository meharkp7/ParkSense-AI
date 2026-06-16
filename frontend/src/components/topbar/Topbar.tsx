import { Bell } from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          ParkSense AI
        </h2>

        <p className="text-sm text-slate-500">
          Bengaluru Traffic Intelligence Platform
        </p>
      </div>

      <button className="rounded-xl border border-slate-200 p-2 hover:bg-slate-100">
        <Bell className="h-5 w-5 text-slate-600" />
      </button>
    </header>
  );
}