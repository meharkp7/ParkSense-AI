import { Plus, Bell, Users, RefreshCw } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
        <Plus className="h-4 w-4" />
        New Alert
      </button>
      
      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <Users className="h-4 w-4" />
        Dispatch
      </button>
      
      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <Bell className="h-4 w-4" />
        Broadcast
      </button>
      
      <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}
