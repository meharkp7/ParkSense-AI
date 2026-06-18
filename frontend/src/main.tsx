import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "@/lib/fixLeaflet";
import { QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import { router } from "@/app/router";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";

import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import {
  LocationProvider,
} from "@/context/LocationContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </LocationProvider>
    </QueryClientProvider>
  </React.StrictMode>
);