const BASE = import.meta.env.VITE_API_BASE_URL || "";

async function request(path) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`);
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

export async function searchPlaces(city) {
  const json = await request(`/api/places/search?city=${encodeURIComponent(city)}`);
  return json.data;
}

export async function getPlaceDetails(placeId) {
  const json = await request(`/api/places/details/${encodeURIComponent(placeId)}`);
  return json.data;
}

export async function calculateRoute(originLat, originLng, destinationLat, destinationLng) {
  const qs = new URLSearchParams({
    originLat,
    originLng,
    destinationLat,
    destinationLng,
  });
  const json = await request(`/api/routes/calculate?${qs}`);
  return json.data;
}
