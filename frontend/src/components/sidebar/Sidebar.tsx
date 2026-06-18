import {
  BrainCircuit,
  LayoutDashboard,
  Map,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    label: "Live Map",
    icon: Map,
    path: "/map",
  },
  {
    label: "Predictions",
    icon: BrainCircuit,
    path: "/predictions",
  },
  {
    label: "Enforcement",
    icon: ShieldCheck,
    path: "/enforcement",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-blue-700">
          ParkSense AI
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Smart City Dashboard
        </p>
      </div>

      <nav className="space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}