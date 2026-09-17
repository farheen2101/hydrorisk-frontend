"""
Risk scoring logic - NOW USING UMAIMA'S REAL TRAINED MODEL.

This file used to compute a placeholder heuristic score while waiting for
the ML model. That's done now - this calls her actual predict_risk()
function from predict_risk.py, which itself loads:
    - hydrorisk_model_slope.pkl          (her trained XGBoost model)
    - hydrorisk_model_slope_features.pkl (the exact 8-feature order)

IMPORTANT: predict_risk.py, hydrorisk_model_slope.pkl, and
hydrorisk_model_slope_features.pkl are NOT modified by this integration -
they sit in this same folder, untouched, exactly as Umaima sent them.
This file only calls her function and reshapes the result for the API.

If, for any reason, her model files are missing (e.g. testing this backend
before her files arrive), this falls back to a simple heuristic so the API
doesn't crash - but that should not be the normal case anymore.
"""

import pandas as pd

_real_predict_available = False
try:
    from predict_risk import predict_risk as _umaima_predict_risk
    _real_predict_available = True
    print("[risk_model] Loaded Umaima's real predict_risk() - using trained XGBoost model.")
except Exception as e:
    print(f"[risk_model] Could not load predict_risk.py / model files: {e}")
    print("[risk_model] Falling back to heuristic scoring until this is fixed.")


SEVERITY_ENCODING = {"Critical": 3, "Major": 2, "Minor": 1, "Unclassified": 1.5}

# The exact columns predict_risk() needs from each hotspot row.
REQUIRED_STATIC_COLUMNS = [
    "elevation_m", "slope_degrees",
    "Aug2000_flood_total_mm", "Aug2008_flood_total_mm", "Oct2020_flood_total_mm",
    "Aug2000_flood_max_daily_mm", "Aug2008_flood_max_daily_mm", "Oct2020_flood_max_daily_mm",
]
REQUIRED_LIVE_COLUMNS = ["current_day_rain_mm", "cum_rainfall_3day", "cum_rainfall_5day"]


def _heuristic_score(row, elevation_min, elevation_max):
    """Fallback only - used if Umaima's model files aren't present."""
    elev_range = max(elevation_max - elevation_min, 1e-6)
    elevation_risk = 1 - ((row["elevation_m"] - elevation_min) / elev_range)
    rain_risk = min(row["cum_rainfall_5day"] / 100.0, 1.0)
    today_bump = min(row["current_day_rain_mm"] / 50.0, 1.0)
    severity_multiplier = SEVERITY_ENCODING.get(row["severity"], 1.0) / 3.0
    raw_score = (0.4 * elevation_risk + 0.35 * rain_risk + 0.15 * today_bump + 0.10 * severity_multiplier)
    return round(raw_score * 100, 1)


def _call_real_model(row):
    """Calls Umaima's predict_risk() with one hotspot row's real values."""
    result = _umaima_predict_risk(
        elevation_m=row["elevation_m"],
        slope_degrees=row["slope_degrees"],
        aug2000_total=row["Aug2000_flood_total_mm"],
        aug2008_total=row["Aug2008_flood_total_mm"],
        oct2020_total=row["Oct2020_flood_total_mm"],
        aug2000_max=row["Aug2000_flood_max_daily_mm"],
        aug2008_max=row["Aug2008_flood_max_daily_mm"],
        oct2020_max=row["Oct2020_flood_max_daily_mm"],
        current_day_rain_mm=row["current_day_rain_mm"],
        cum_rainfall_3day=row["cum_rainfall_3day"],
        cum_rainfall_5day=row["cum_rainfall_5day"],
    )
    return result


def compute_risk_scores(hotspots_df: pd.DataFrame) -> pd.DataFrame:
    """
    Takes the combined hotspots dataframe (with current rainfall columns
    already joined in) and returns it with risk columns added.
    """
    df = hotspots_df.copy()

    missing_static = [c for c in REQUIRED_STATIC_COLUMNS if c not in df.columns]
    missing_live = [c for c in REQUIRED_LIVE_COLUMNS if c not in df.columns]
    if missing_static or missing_live:
        raise ValueError(
            f"hotspots data is missing columns the model needs. "
            f"Missing static: {missing_static}, missing live: {missing_live}"
        )

    if _real_predict_available:
        results = df.apply(_call_real_model, axis=1, result_type="expand")
        df["risk_score"] = results["live_risk_score"]
        df["static_risk_score"] = results["static_risk_score"]
        df["high_risk_probability"] = results["high_risk_probability"]
        df["risk_level"] = results["risk_level"]
        df["risk_source"] = "trained_model"
    else:
        elevation_min, elevation_max = df["elevation_m"].min(), df["elevation_m"].max()
        df["risk_score"] = df.apply(lambda r: _heuristic_score(r, elevation_min, elevation_max), axis=1)
        df["static_risk_score"] = df["risk_score"]
        df["high_risk_probability"] = None
        df["risk_level"] = pd.cut(df["risk_score"], bins=[-1, 40, 70, 101], labels=["Low", "Moderate", "High"]).astype(str)
        df["risk_source"] = "heuristic"

    return df


def apply_rainfall_override(hotspots_df: pd.DataFrame, rainfall_override_mm: float) -> pd.DataFrame:
    """
    For the live interactive demo: lets a judge type in a hypothetical
    rainfall value and see risk scores update in real time.
    """
    df = hotspots_df.copy()
    df["current_day_rain_mm"] = rainfall_override_mm
    df["cum_rainfall_5day"] = df["cum_rainfall_5day"] - df["current_day_rain_mm"] + rainfall_override_mm
    return df
