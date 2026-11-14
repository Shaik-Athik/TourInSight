import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const POPULAR = ["Hyderabad", "Goa", "Jaipur", "Kerala", "Delhi", "Mumbai"];

export default function Home() {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const go = (value) => {
    const c = value.trim();
    if (c) navigate(`/explore?city=${encodeURIComponent(c)}`);
  };

  return (
    <>
      <section className="hero">
        <h1>Find your next adventure</h1>
        <p>Discover tourist places, plan driving routes and get recommendations tailored to your interests and budget.</p>
        <form
          className="search-bar"
          onSubmit={(e) => {
            e.preventDefault();
            go(city);
          }}
        >
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search a city, e.g. Hyderabad"
            aria-label="City"
          />
          <button className="btn" type="submit">Search</button>
        </form>
        <div className="chips">
          {POPULAR.map((c) => (
            <button key={c} className="chip" onClick={() => go(c)}>{c}</button>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <span>🗺️</span>
          <h3>Explore places</h3>
          <p>Live tourist spots for any city, shown on an interactive map.</p>
          <Link to="/explore">Start exploring →</Link>
        </div>
        <div className="feature">
          <span>🚗</span>
          <h3>Plan your route</h3>
          <p>Get driving distance, travel time and the route drawn on the map.</p>
          <Link to="/explore">Find a place →</Link>
        </div>
        <div className="feature">
          <span>✨</span>
          <h3>Smart recommendations</h3>
          <p>Ranked by rating, cost and distance based on your interests.</p>
          <Link to="/recommend">Get recommendations →</Link>
        </div>
      </section>
    </>
  );
}
