# HydroRisk — Frontend

React + Vite frontend for the HydroRisk citizen flood-risk dashboard, built to match
the Figma reference and talk to the FastAPI backend in `main.py`.

## What's here vs. the original mock

- **Left sidebar promo card** now shows a Charminar photo instead of the water-tank
  illustration (`src/components/PromoCard.jsx`). It loads from Wikimedia Commons by
  default — swap in a local asset under `src/assets` if you'd rather bundle it.
- **Sign In / Sign Up pages** (`src/pages/SignIn.jsx`, `SignUp.jsx`). The backend has
  no auth routes yet, so these use a small client-side session
  (`src/context/AuthContext.jsx`, stored in `localStorage`). Swap `signIn`/`signUp`
  for real API calls once a `/login` / `/signup` endpoint exists.
- **No chevron arrows** on the four bottom stat cards (Live Rainfall, Soil Saturation,
  Flood Risk Level, Last Updated) — `src/components/StatsBar.jsx`.
- **Photo upload on "Report Flooding Here"** (`src/components/PhotoUpload.jsx`, used
  in `src/pages/ReportIssue.jsx`) — tap to take/choose a photo or drag one in, with a
  preview and remove button. The backend's `CitizenReportCreate` schema
  (`schemas.py`) doesn't have an image field yet, so the photo is captured
  client-side and ready to send the moment the backend adds a multipart upload route
  or an `image_url` column — see the comment in `ReportIssue.jsx`.

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # point at your backend if it's not on localhost:8000
npm run dev
```

Runs the backend separately with `uvicorn main:app --reload` (see the backend's own
README) — the frontend expects it at `http://127.0.0.1:8000` by default.

## Structure

```
src/
  components/   Sidebar, TopBar, MapPanel, RiskDetailsPanel, StatsBar, PhotoUpload...
  pages/        MapView, RiskUpdates, ReportIssue, Resources, SettingsPage, SignIn, SignUp
  context/      AuthContext (client-side session)
  lib/api.js    fetch wrapper for /hotspots, /risk-scores, /reports
  data/         Hyderabad bounding box + severity colors for marker placement
  styles.css    single global stylesheet
```

## Notes

- The map is a stylized panel (matching the mock), not real map tiles — hotspot pins
  are positioned by projecting lat/long onto a Hyderabad bounding box
  (`src/data/hyderabadBounds.js`). Swap in Leaflet/Mapbox later if you want real
  tiles; the marker data (`getRiskScores()`) is already shaped for it.
- Routes `/`, `/risk-updates`, `/report`, `/resources`, `/settings` require a signed-in
  session and redirect to `/signin` otherwise.
