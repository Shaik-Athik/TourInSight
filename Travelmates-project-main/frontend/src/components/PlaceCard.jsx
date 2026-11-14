import { Link } from "react-router-dom";
import { usefulTypes, prettyType } from "../utils.js";

export default function PlaceCard({ place }) {
  return (
    <article className="card">
      <h3>{place.name}</h3>
      <p className="muted">📍 {place.address}</p>
      <div className="tags">
        {usefulTypes(place.types).map((t) => (
          <span className="tag" key={t}>{prettyType(t)}</span>
        ))}
      </div>
      <Link to={`/place/${place.id}`} state={{ place }} className="btn btn-small">
        View details &amp; route
      </Link>
    </article>
  );
}
