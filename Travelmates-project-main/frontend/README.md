# Travelmates Frontend

React + Vite frontend for the Travelmates project.

## Features

- **Home** – hero search and popular cities
- **Explore** – search tourist places for any city (list + interactive map)
- **Place details** – address, categories, and driving route (distance, time, polyline on the map) from typed coordinates or your current location
- **Recommendations** – ranked places by interests, budget and days (same scoring as `AI_recommendation/recommendation.py`)

## Run locally

1. Start the backend (needs `GOOGLE_PLACES_API_KEY` in `backend/.env`):
   ```bash
   cd backend
   npm install
   node server.js        # http://localhost:5000
   ```
2. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm run dev           # http://localhost:5173
   ```
   In development, Vite proxies `/api` to `http://localhost:5000`.

## Build for production

```bash
npm run build
```

Set `VITE_API_BASE_URL` (see `.env.example`) to your deployed backend URL before building.

## Structure

```
src/
  api.js            backend calls
  recommend.js      JS port of the Python recommender
  utils.js          polyline decode, formatting
  components/       Navbar, PlaceCard, MapView, Loader
  pages/            Home, Explore, PlaceDetails, Recommend
public/places.csv   data for recommendations (copy of AI_recommendation/places.csv)
```
