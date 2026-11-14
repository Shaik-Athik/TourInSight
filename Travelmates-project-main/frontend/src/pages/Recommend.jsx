import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadPlacesCsv, recommendPlaces } from "../recommend.js";
import Loader from "../components/Loader.jsx";

export default function Recommend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [city, setCity] = useState("");
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState(500);
  const [days, setDays] = useState(3);
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadPlacesCsv()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(data.map((p) => p.city))].sort();
  const categories = [...new Set(data.map((p) => p.category))].sort();

  const toggle = (c) =>
    setInterests((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const submit = (e) => {
    e.preventDefault();
    setResults(recommendPlaces(data, city, interests, Number(budget), Number(days)));
  };

  if (loading) return <Loader text="Loading travel data..." />;
  if (error) return <div className="alert">{error}</div>;

  return (
    <>
      <h1 className="page-title">Smart recommendations</h1>
      <p className="muted">
        Tell us what you like. Places are ranked by rating, cost and distance.
      </p>

      <div className="split details">
        <form className="panel form" onSubmit={submit}>
          <label>
            City
            <select value={city} onChange={(e) => setCity(e.target.value)} required>
              <option value="">Select a city</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>Interests</legend>
            <div className="chips">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={interests.includes(c) ? "chip selected" : "chip"}
                  onClick={() => toggle(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Budget per place (₹)
            <input
              type="number"
              min="0"
              step="50"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </label>

          <label>
            Number of days
            <input
              type="number"
              min="1"
              max="14"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              required
            />
          </label>

          <button className="btn" type="submit" disabled={!city || interests.length === 0}>
            Recommend places
          </button>
        </form>

        <section>
          {results === null && (
            <div className="empty">Fill in the form to see your personalised list.</div>
          )}
          {results && results.length === 0 && (
            <div className="empty">
              No suitable places found. Try more interests or a higher budget.
            </div>
          )}
          {results && results.length > 0 && (
            <>
              <h2>Top {results.length} for you</h2>
              <ol className="rec-list">
                {results.map((r, i) => (
                  <li key={r.place} className="card rec">
                    <span className="rank">{i + 1}</span>
                    <div>
                      <h3>{r.place}</h3>
                      <div className="tags">
                        <span className="tag">{r.category}</span>
                        <span className="tag">⭐ {r.rating}</span>
                        <span className="tag">{r.cost === 0 ? "Free" : `₹${r.cost}`}</span>
                        <span className="tag">{r.distance} km</span>
                      </div>
                    </div>
                    <div className="score">
                      <strong>{r.score}</strong>
                      <span>score</span>
                    </div>
                  </li>
                ))}
              </ol>
              <Link to={`/explore?city=${encodeURIComponent(city)}`} className="btn btn-outline">
                See {city} on the map
              </Link>
            </>
          )}
        </section>
      </div>
    </>
  );
}
