// Decode a Google encoded polyline into [[lat, lng], ...]
export function decodePolyline(encoded) {
  if (!encoded) return [];
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    for (const axis of ["lat", "lng"]) {
      let result = 0, shift = 0, byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === "lat") lat += delta;
      else lng += delta;
    }
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

// "5400s" -> "1 hr 30 min"
export function formatDuration(duration) {
  const seconds = parseInt(String(duration).replace("s", ""), 10);
  if (Number.isNaN(seconds)) return "-";
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m || 1} min`;
}

// "tourist_attraction" -> "Tourist attraction"
export function prettyType(type) {
  const t = type.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const IGNORED_TYPES = ["point_of_interest", "establishment"];
export function usefulTypes(types = [], max = 3) {
  return types.filter((t) => !IGNORED_TYPES.includes(t)).slice(0, max);
}
