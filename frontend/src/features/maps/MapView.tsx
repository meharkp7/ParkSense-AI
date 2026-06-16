import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";

import { hotspots } from "@/services/mock/hotspots";

function getColor(pci: number) {
  if (pci >= 0.85) return "#DC2626";
  if (pci >= 0.70) return "#F59E0B";
  return "#16A34A";
}

export default function MapView() {
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
          PCI heatmap and hotspot monitoring
        </p>
      </div>

      <div className="h-[600px] overflow-hidden rounded-xl">
        <MapContainer
          center={[12.9716, 77.5946]}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((spot) => (
            <CircleMarker
              key={spot.id}
              center={[spot.lat, spot.lon]}
              radius={15}
              pathOptions={{
                color: getColor(spot.pci),
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <div className="space-y-2">
                  <h3 className="font-bold">
                    {spot.location}
                  </h3>

                  <p>PCI: {spot.pci}</p>

                  <p>
                    Violations: {spot.violations}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}