# HydroRisk Backend - Setup Guide

## 1. Setup (one time)

Put all these files in a folder, along with `hotspots_MASTER_COMBINED.csv`
(your combined dataset from earlier):

```
hydrorisk_backend/
    main.py
    database.py
    models.py
    schemas.py
    risk_model.py
    data_loader.py
    requirements.txt
    hotspots_MASTER_COMBINED.csv   <- copy this in from your data pipeline folder
```

Install dependencies:
```bash
pip install -r requirements.txt
```

## 2. Run it

```bash
uvicorn main:app --reload
```

You should see something like:
```
[data_loader] Loaded 308 hotspots from hotspots_MASTER_COMBINED.csv
[risk_model] No trained model found yet - using heuristic placeholder scoring.
Uvicorn running on http://127.0.0.1:8000
```

## 3. Test it (no coding needed)

Open **http://127.0.0.1:8000/docs** in your browser. This is FastAPI's
auto-generated interactive docs page - you can click "Try it out" on any
endpoint and run it right there.

Try these in order:
1. `GET /health` - should just return `{"status": "ok"}`
2. `GET /hotspots` - should return your 308 hotspots
3. `GET /risk-scores` - should return risk scores 0-100 for each hotspot
4. `GET /risk-scores?rainfall_override_mm=80` - try a big number, watch scores jump up. This is the "judge types in a rainfall value and sees the map update" demo feature.
5. `POST /reports` - try submitting a fake report, e.g.:
   ```json
   {
     "latitude": 17.4,
     "longitude": 78.48,
     "severity": "Major",
     "description": "test report"
   }
   ```
6. `GET /reports` - you should see the report you just submitted
7. `GET /reports/count` - should show `{"count": 1}`

If all 7 of those work, your backend is fully functional.

## 4. When Umaima's trained model is ready

She needs to give you exactly two files:
- `trained_model.pkl` (saved with `joblib.dump(model, "trained_model.pkl")`)
- `model_feature_columns.json` - a list of the exact feature names her
  model expects, in order, e.g.:
  ```json
  ["severity_encoded", "elevation_m", "current_day_rain_mm", "cum_rainfall_3day", "cum_rainfall_5day"]
  ```

Drop both files into this same folder, restart the server, and `/risk-scores`
will automatically start using her real model instead of the heuristic - no
code changes needed. You'll see the startup message change from
"using heuristic placeholder scoring" to "Loaded trained model with features: [...]".

**Important: tell Umaima to use exactly these feature names** (or update
`FEATURE_COLUMNS` logic in `risk_model.py` together if she needs different
ones) so the handoff is a drop-in, not a debugging session two days before
the deadline.

## 5. For Farheen (frontend)

Base URL once you deploy or run this: `http://127.0.0.1:8000` (locally) or
wherever you end up hosting it.

Endpoints she needs:
- `GET /hotspots` - static pins for the map (use `map_latitude`/`map_longitude`, not `latitude`/`longitude`)
- `GET /risk-scores` - same data but with live `risk_score` added - color the pins by this
- `GET /risk-scores?rainfall_override_mm=X` - for the interactive demo slider/input
- `POST /reports` - the "Report flooding here" button/form submits here
- `GET /reports` - citizen-reported pins to overlay on the map
- `GET /reports/count` - for a "N reports and growing" counter badge

CORS is already enabled wide-open, so her frontend can call this directly
from the browser during development.
