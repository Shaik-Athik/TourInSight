import { useEffect, useRef } from "react";
import L from "leaflet";

// Fix default marker icons when bundled with Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * markers: [{ id, lat, lng, label }]
 * path:    [[lat, lng], ...]   (optional route polyline)
 * origin:  { lat, lng }        (optional start point)
 */
export default function MapView({ markers = [], path = [], origin = null, height = 400 }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const map = L.map(elRef.current).setView([20.59, 78.96], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);
    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    const bounds = [];

    markers.forEach((m) => {
      if (m.lat == null || m.lng == null) return;
      L.marker([m.lat, m.lng]).addTo(layer).bindPopup(m.label || "");
      bounds.push([m.lat, m.lng]);
    });

    if (origin) {
      L.circleMarker([origin.lat, origin.lng], {
        radius: 8,
        color: "#fff",
        weight: 2,
        fillColor: "#2563eb",
        fillOpacity: 1,
      })
        .addTo(layer)
        .bindPopup("Start");
      bounds.push([origin.lat, origin.lng]);
    }

    if (path.length) {
      L.polyline(path, { color: "#2563eb", weight: 5 }).addTo(layer);
      bounds.push(...path);
    }

    if (bounds.length === 1) map.setView(bounds[0], 14);
    else if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });
  }, [markers, path, origin]);

  return <div ref={elRef} className="map" style={{ height }} />;
}
