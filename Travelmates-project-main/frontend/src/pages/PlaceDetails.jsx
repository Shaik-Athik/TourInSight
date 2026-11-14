import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { calculateRoute, getPlaceDetails } from "../api.js";
import { decodePolyline, formatDuration, prettyType, usefulTypes } from "../utils.js";
import MapView from "../components/MapView.jsx";
import Loader from "../components/Loader.jsx";

export default function PlaceDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [place, setPlace] = useState(location.state?.place || null);
  const [loading, setLoading] = useState(!location.state?.place);
  const [error, setError] = useState("");

  const [origin, setOrigin] = useState({ lat: "", lng: "" });
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getPlaceDetails(id)
      .then((d) => !cancelled && setPlace(d))
      .catch((e) => {
        if (!cancelled && !location.state?.place) setError(e.message);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const path = useMemo(() => decodePolyline(route?.polyline), [route]);
  const originPoint = useMemo(() => {
    const lat = parseFloat(origin.lat);
    const lng = parseFloat(origin.lng);
    return route && !Number.isNaN(lat) && !Number.isNaN(lng) ? { lat, lng } : null;
  }, [route, origin]);

  const markers = useMemo(
    () =>
      place && place.latitude != null
        ? [{ id: place.id, lat: place.latitude, lng: place.longitude, label: place.name }]
        : [],
    [place]
  );

  const useMyLocation = () => {
    setRouteError("");
    if (!navigator.geolocation) {
      setRouteError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setOrigin({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        }),
      () => setRouteError("Could not get your location. Enter coordinates manually."),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getRoute = async (e) => {
    e.preventDefault();
    setRouteError("");
    setRoute(null);
    const lat = parseFloat(origin.lat);
    const lng = parseFloat(origin.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setRouteError("Enter a valid starting latitude and longitude.");
      return;
    }
    setRouteLoading(true);
    try {
      setRoute(await calculateRoute(lat, lng, place.latitude, place.longitude));
    } catch (err) {
      setRouteError(err.message);
    } finally {
      setRouteLoading(false);
    }
  };

  if (loading && !place) return <Loader text="Loading place..." />;
  if (error || !place) {
    return (
      <div className="empty">
        <div className="alert">{error || "Place not found."}</div>
        <Link to="/explore" className="btn">Back to explore</Link>
      </div>
    );
  }

  const canRoute = place.latitude != null && place.longitude != null;

  return (
    <>
      <button className="back" onClick={() => window.history.back()}>← Back</button>
      <h1 className="page-title">{place.name}</h1>
      <p className="muted">📍 {place.address}</p>
      <div className="tags">
        {usefulTypes(place.types, 6).map((t) => (
          <span className="tag" key={t}>{prettyType(t)}</span>
        ))}
      </div>

      <div className="split details">
        <section className="panel">
          <h2>Plan a route</h2>
          {!canRoute ? (
            <p className="muted">This place has no coordinates, so a route can't be calculated.</p>
          ) : (
            <form onSubmit={getRoute} className="form">
              <label>
                Start latitude
                <input
                  value={origin.lat}
                  onChange={(e) => setOrigin({ ...origin, lat: e.target.value })}
                  placeholder="e.g. 17.3850"
                />
              </label>
              <label>
                Start longitude
                <input
                  value={origin.lng}
                  onChange={(e) => setOrigin({ ...origin, lng: e.target.value })}
                  placeholder="e.g. 78.4867"
                />
              </label>
              <div className="row">
                <button type="button" className="btn btn-outline" onClick={useMyLocation}>
                  📡 Use my location
                </button>
                <button className="btn" type="submit" disabled={routeLoading}>
                  {routeLoading ? "Calculating..." : "Get route"}
                </button>
              </div>
            </form>
          )}

          {routeError && <div className="alert">{routeError}</div>}

          {route && (
            <div className="stats">
              <div><strong>{route.distanceKm} km</strong><span>Distance</span></div>
              <div><strong>{formatDuration(route.duration)}</strong><span>Drive time</span></div>
            </div>
          )}
        </section>

        <MapView markers={markers} path={path} origin={originPoint} height={460} />
      </div>
    </>
  );
}
