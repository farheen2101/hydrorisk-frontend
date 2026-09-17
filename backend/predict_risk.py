import joblib
import pandas as pd


# ============================================================
# 1. LOAD THE FINAL HYDRORISK MODEL
# ============================================================

model = joblib.load("hydrorisk_model_slope.pkl")
FEATURE_COLUMNS = joblib.load("hydrorisk_model_slope_features.pkl")


# ============================================================
# 2. LIVE RAINFALL RISK CALCULATION
# ============================================================

def calculate_live_risk(
    static_probability,
    current_day_rain_mm,
    cum_rainfall_3day,
    cum_rainfall_5day
):
    """
    Combines the ML model's static risk probability
    with current rainfall conditions.

    Returns:
        final risk score (0-100)
        risk level (Low / Moderate / High)
    """

    # Convert ML probability into a 0-100 base score
    base_score = static_probability * 100

    # Calculate rainfall pressure
    rainfall_pressure = (
        current_day_rain_mm * 0.8
        + cum_rainfall_3day * 0.25
        + cum_rainfall_5day * 0.10
    )

    # Limit rainfall contribution to 30 points
    rainfall_boost = min(30, rainfall_pressure)

    # Final risk score
    final_score = base_score + rainfall_boost

    # Keep score between 0 and 100
    final_score = min(100, max(0, final_score))

    # Convert score into risk level
    if final_score >= 70:
        risk_level = "High"
    elif final_score >= 40:
        risk_level = "Moderate"
    else:
        risk_level = "Low"

    return round(final_score, 1), risk_level


# ============================================================
# 3. MAIN HYDRORISK PREDICTION FUNCTION
# ============================================================

def predict_risk(
    elevation_m,
    slope_degrees,
    aug2000_total,
    aug2008_total,
    oct2020_total,
    aug2000_max,
    aug2008_max,
    oct2020_max,
    current_day_rain_mm,
    cum_rainfall_3day,
    cum_rainfall_5day
):
    """
    Predicts HydroRisk for one location.

    STATIC FEATURES:
        - elevation
        - slope
        - historical rainfall totals
        - historical maximum daily rainfall

    LIVE FEATURES:
        - current day rainfall
        - 3-day cumulative rainfall
        - 5-day cumulative rainfall

    Returns:
        dictionary containing:
        - high_risk_probability
        - static_risk_score
        - live_risk_score
        - risk_level
    """

    # --------------------------------------------------------
    # Build the 8 features required by the ML model
    # --------------------------------------------------------

    features = pd.DataFrame([{
        "elevation_m": elevation_m,
        "slope_degrees": slope_degrees,

        "Aug2000_flood_total_mm": aug2000_total,
        "Aug2008_flood_total_mm": aug2008_total,
        "Oct2020_flood_total_mm": oct2020_total,

        "Aug2000_flood_max_daily_mm": aug2000_max,
        "Aug2008_flood_max_daily_mm": aug2008_max,
        "Oct2020_flood_max_daily_mm": oct2020_max
    }])[FEATURE_COLUMNS]


    # --------------------------------------------------------
    # Get ML probability of High Risk
    # --------------------------------------------------------

    static_probability = model.predict_proba(features)[0][1]

    static_score = static_probability * 100


    # --------------------------------------------------------
    # Add live rainfall conditions
    # --------------------------------------------------------

    live_score, risk_level = calculate_live_risk(
        static_probability,
        current_day_rain_mm,
        cum_rainfall_3day,
        cum_rainfall_5day
    )


    # --------------------------------------------------------
    # Return final result
    # --------------------------------------------------------

    return {
    "high_risk_probability": round(float(static_probability), 3),
    "static_risk_score": round(float(static_score), 1),
    "live_risk_score": round(float(live_score), 1),
    "risk_level": risk_level
}


# ============================================================
# 4. TEST THE FILE
# ============================================================

if __name__ == "__main__":

    result = predict_risk(
        elevation_m=530,
        slope_degrees=3.5,

        aug2000_total=249.8,
        aug2008_total=237.7,
        oct2020_total=170.7,

        aug2000_max=128.0,
        aug2008_max=58.8,
        oct2020_max=80.5,

        current_day_rain_mm=25,
        cum_rainfall_3day=40,
        cum_rainfall_5day=70
    )

    print("\nHydroRisk Prediction")
    print("--------------------")
    print(f"High-risk probability : {result['high_risk_probability']}")
    print(f"Static risk score     : {result['static_risk_score']}")
    print(f"Live risk score       : {result['live_risk_score']}")
    print(f"Risk level            : {result['risk_level']}")