import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import "leaflet/dist/leaflet.css";
import { router } from "@/app/router";
import { TooltipProvider } from "@/components/ui/tooltip";
import "leaflet/dist/leaflet.css";
import "@/lib/fixLeaflet";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </React.StrictMode>
);