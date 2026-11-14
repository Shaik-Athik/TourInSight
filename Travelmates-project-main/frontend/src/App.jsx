import { Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import PlaceDetails from "./pages/PlaceDetails.jsx";
import Recommend from "./pages/Recommend.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/place/:id" element={<PlaceDetails />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route
            path="*"
            element={
              <div className="empty">
                <h2>Page not found</h2>
                <Link to="/" className="btn">Go home</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="footer">© {new Date().getFullYear()} Travelmates</footer>
    </>
  );
}
