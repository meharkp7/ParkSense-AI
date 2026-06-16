import { NavLink } from "react-router-dom";
import { Car, Map, Brain, Shield } from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: Car,
  },
  {
    name: "Live Map",
    path: "/map",
    icon: Map,
  },
  {
    name: "Predictions",
    path: "/predictions",
    icon: Brain,
  },
  {
    name: "Enforcement",
    path: "/enforcement",
    icon: Shield,
  },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-slate-950">
      <h1 className="text-2xl font-bold text-blue-400">
        🚗 ParkSense AI
      </h1>

      <div className="flex gap-6">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-2 transition ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-400 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {link.name}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}