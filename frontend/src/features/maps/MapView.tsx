import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import { useHotspots } from "@/hooks/useHotspots";

export default function MapView() {
  const {
    data: hotspots,
    isLoading,
    isError,
  } = useHotspots();

  if (isLoading) {
    return (
      <div className="h-[600px] animate-pulse rounded-2xl bg-slate-100" />
    );
  }

  if (isError || !hotspots) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-red-600">
        Failed to load hotspot data.
      </div>
    );
  }

  return (
    <div
      className="
        rounded-2xl
        border border-slate-200
        bg-white/75
        backdrop-blur-md
        p-4
        shadow-sm
      "
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Bengaluru Parking Intelligence Map
        </h2>

        <p className="text-sm text-slate-500">
          Live hotspot monitoring and congestion analytics
        </p>
      </div>

      <div className="h-[600px] overflow-hidden rounded-xl">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          scrollWheelZoom={true}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((spot) => {
            const radius = Math.min(
              25,
              Math.max(
                8,
                Math.log10(spot.violations) * 5
              )
            );

            const color =
              spot.violations > 20000
                ? "#DC2626"
                : spot.violations > 10000
                ? "#F59E0B"
                : "#16A34A";

            return (
              <CircleMarker
                key={spot.hotspot_id}
                center={[
                  spot.mean_lat,
                  spot.mean_lon,
                ]}
                radius={radius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <h3 className="font-bold text-slate-800">
                      Hotspot #{spot.hotspot_id}
                    </h3>

                    <div className="text-sm text-slate-600">
                      <p>
                        <strong>Violations:</strong>{" "}
                        {spot.violations.toLocaleString()}
                      </p>

                      <p>
                        <strong>Unique Roads:</strong>{" "}
                        {spot.unique_locations}
                      </p>

                      <p>
                        <strong>Latitude:</strong>{" "}
                        {spot.mean_lat.toFixed(4)}
                      </p>

                      <p>
                        <strong>Longitude:</strong>{" "}
                        {spot.mean_lon.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}