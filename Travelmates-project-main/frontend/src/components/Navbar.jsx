import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const cls = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">🧭 Travelmates</Link>
        <nav>
          <NavLink to="/" end className={cls}>Home</NavLink>
          <NavLink to="/explore" className={cls}>Explore</NavLink>
          <NavLink to="/recommend" className={cls}>Recommendations</NavLink>
        </nav>
      </div>
    </header>
  );
}
