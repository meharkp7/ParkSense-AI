import { createBrowserRouter } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import LiveMap from "@/pages/LiveMap";
import Predictions from "@/pages/Predictions";
import Enforcement from "@/pages/Enforcement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/map",
    element: <LiveMap />,
  },
  {
    path: "/predictions",
    element: <Predictions />,
  },
  {
    path: "/enforcement",
    element: <Enforcement />,
  },
]);