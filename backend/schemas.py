"""
Pydantic schemas - these define exactly what shape of data the API
accepts (requests) and sends back (responses). FastAPI uses these to
auto-validate incoming data (e.g. rejects a request missing "latitude")
and to auto-generate the interactive API docs at /docs.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


# ---------- Citizen reports ----------

class CitizenReportCreate(BaseModel):
    """What a citizen submits when they tap 'Report flooding here'."""
    latitude: float = Field(..., ge=17.0, le=18.0, description="Must be within Hyderabad's rough latitude range")
    longitude: float = Field(..., ge=78.0, le=79.0, description="Must be within Hyderabad's rough longitude range")
    severity: str = Field(..., description="One of: Minor, Major, Critical")
    description: Optional[str] = Field(None, max_length=500)


class CitizenReportOut(BaseModel):
    """What the API sends back for a stored report."""
    id: int
    latitude: float
    longitude: float
    severity: str
    description: Optional[str]
    reported_at: datetime

    class Config:
        from_attributes = True  # lets this read directly from the SQLAlchemy model


# ---------- Hotspots / risk scores ----------

class HotspotOut(BaseModel):
    hotspot_id: str
    location_raw: str
    severity: str
    latitude: float
    longitude: float
    map_latitude: float
    map_longitude: float
    elevation_m: float
    slope_degrees: float
    geocode_precision: str


class RiskScoreOut(BaseModel):
    hotspot_id: str
    location_raw: str
    severity: str
    latitude: float
    longitude: float
    map_latitude: float
    map_longitude: float
    elevation_m: float
    slope_degrees: float
    current_day_rain_mm: float
    cum_rainfall_5day: float
    risk_score: float = Field(..., description="0-100 live risk score (includes today's rainfall boost). This is Umaima's live_risk_score.")
    static_risk_score: float = Field(..., description="0-100 score from the ML model alone, before today's rainfall is factored in.")
    high_risk_probability: Optional[float] = Field(None, description="Raw XGBoost probability of High Risk (0-1). None if using heuristic fallback.")
    risk_level: str = Field(..., description="Low / Moderate / High")
    risk_source: str = Field(..., description="'heuristic' (placeholder) or 'trained_model' (Umaima's model)")


# ---------- Auth (signup/login for Farheen's frontend) ----------

class SignupRequest(BaseModel):
    email: str = Field(..., description="Must contain '@' - kept as plain str, not Pydantic's EmailStr, to avoid needing the extra email-validator package")
    password: str = Field(..., min_length=6, description="Minimum 6 characters")


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    """Returned on both signup and login - the frontend stores this token
    and sends it back on later requests that need to know who's logged in."""
    token: str
    user_id: int
    email: str

