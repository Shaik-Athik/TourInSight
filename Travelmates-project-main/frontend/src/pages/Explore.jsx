import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPlaces } from "../api.js";
import PlaceCard from "../components/PlaceCard.jsx";
import MapView from "../components/MapView.jsx";
import Loader from "../components/Loader.jsx";

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const cityParam = params.get("city") || "";
  const [input, setInput] = useState(cityParam);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setInput(cityParam);
    if (!cityParam) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    searchPlaces(cityParam)
      .then((data) => !cancelled && setPlaces(data))
      .catch((e) => {
        if (!cancelled) {
          setError(e.message);
          setPlaces([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setSearched(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cityParam]);

  const markers = useMemo(
    () =>
      places
        .filter((p) => p.latitude != null && p.longitude != null)
        .map((p) => ({ id: p.id, lat: p.latitude, lng: p.longitude, label: p.name })),
    [places]
  );

  const submit = (e) => {
    e.preventDefault();
    const c = input.trim();
    if (c) setParams({ city: c });
  };

  return (
    <>
      <h1 className="page-title">Explore places</h1>
      <form className="search-bar" onSubmit={submit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a city"
          aria-label="City"
        />
        <button className="btn" type="submit">Search</button>
      </form>

      {loading && <Loader text={`Finding places in ${cityParam}...`} />}
      {error && <div className="alert">{error}</div>}

      {!loading && !error && searched && places.length === 0 && (
        <div className="empty">No places found for “{cityParam}”.</div>
      )}

      {!loading && places.length > 0 && (
        <>
          <p className="muted">{places.length} places in <strong>{cityParam}</strong></p>
          <div className="split">
            <div className="grid">
              {places.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
            <div className="sticky-map">
              <MapView markers={markers} height={520} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
