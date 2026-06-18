import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import MarkerClusterGroup from "react-leaflet-cluster";

import { useEffect } from "react";

import L from "@/lib/leafletHeat";

import { useHotspots } from "@/hooks/useHotspots";
import { useLocation } from "@/context/LocationContext";

interface MapViewProps {
  search: string;
  severity: string;
}

function Heatmap({
  data,
}: {
  data: any[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!data?.length) return;

    const points = data.map(
      (spot: any) => [
        spot.mean_lat,
        spot.mean_lon,
        Math.min(
          spot.violations /
            50000,
          1
        ),
      ]
    );

    const heatLayer = (
      L as any
    ).heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(
        heatLayer
      );
    };
  }, [map, data]);

  return null;
}

export default function MapView({
  search,
  severity,
}: MapViewProps) {
  const {
    data: hotspots,
    isLoading,
    isError,
  } = useHotspots();

  const {
    setSelectedLocation,
  } = useLocation();

  if (isLoading) {
    return (
      <div className="h-[700px] animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (isError || !hotspots) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        Failed to load hotspots.
      </div>
    );
  }

  const filteredHotspots =
    hotspots.filter((spot: any) => {
      const matchesSearch =
        spot.hotspot_id
          .toString()
          .includes(search);

      let matchesSeverity = true;

      if (severity === "critical") {
        matchesSeverity =
          spot.violations > 20000;
      }

      if (severity === "medium") {
        matchesSeverity =
          spot.violations > 10000 &&
          spot.violations <= 20000;
      }

      if (severity === "low") {
        matchesSeverity =
          spot.violations <= 10000;
      }

      return (
        matchesSearch &&
        matchesSeverity
      );
    });

  return (
    <div
      className="
        rounded-3xl
        border border-slate-200
        bg-white/80
        backdrop-blur-md
        p-4
        shadow-sm
      "
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Bengaluru Congestion Map
          </h2>

          <p className="text-sm text-slate-500">
            Real-time hotspot monitoring
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
          ● LIVE
        </div>
      </div>

      <div className="h-[700px] overflow-hidden rounded-2xl">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Heatmap
            data={
              filteredHotspots
            }
          />

          <MarkerClusterGroup
            chunkedLoading
            spiderfyOnMaxZoom
            showCoverageOnHover={
              false
            }
          >
            {filteredHotspots.map(
              (spot: any) => {
                const color =
                  spot.violations > 20000
                    ? "#DC2626"
                    : spot.violations >
                      10000
                    ? "#F59E0B"
                    : "#16A34A";

                const radius =
                  spot.violations >
                  50000
                    ? 20
                    : spot.violations >
                      20000
                    ? 16
                    : 12;

                return (
                  <CircleMarker
                    key={
                      spot.hotspot_id
                    }
                    center={[
                      spot.mean_lat,
                      spot.mean_lon,
                    ]}
                    radius={radius}
                    pathOptions={{
                      color,
                      fillColor:
                        color,
                      fillOpacity: 0.7,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => {
                        if (
                          spot.top_location
                        ) {
                          setSelectedLocation(
                            spot.top_location
                          );
                        }
                      },
                    }}
                  >
                    <Popup>
                      <div className="min-w-[220px] space-y-3">
                        <h3 className="text-lg font-bold text-slate-900">
                          Hotspot #
                          {
                            spot.hotspot_id
                          }
                        </h3>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-slate-100 p-2">
                            <p className="text-xs text-slate-500">
                              Violations
                            </p>

                            <p className="font-bold text-slate-900">
                              {spot.violations.toLocaleString()}
                            </p>
                          </div>

                          <div className="rounded-lg bg-slate-100 p-2">
                            <p className="text-xs text-slate-500">
                              Roads
                            </p>

                            <p className="font-bold text-slate-900">
                              {
                                spot.unique_locations
                              }
                            </p>
                          </div>
                        </div>

                        <div
                          className={`
                            rounded-full px-3 py-1 text-center text-sm font-semibold
                            ${
                              spot.violations >
                              20000
                                ? "bg-red-100 text-red-700"
                                : spot.violations >
                                  10000
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }
                          `}
                        >
                          {spot.violations >
                          20000
                            ? "CRITICAL"
                            : spot.violations >
                              10000
                            ? "MEDIUM"
                            : "LOW"}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {spot.top_location}
                      </p>
                    </Popup>
                  </CircleMarker>
                );
              }
            )}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}