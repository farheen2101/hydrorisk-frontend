"""
HydroRisk backend API.

Run this with:
    uvicorn main:app --reload

Then open http://127.0.0.1:8000/docs in a browser - FastAPI auto-generates
an interactive page there where you can test every endpoint by clicking
buttons, no separate tool needed. Genuinely one of the best things about
FastAPI for a beginner.
"""

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from database import engine, get_db, Base
from models import CitizenReport, User
from schemas import (
    CitizenReportCreate, CitizenReportOut, HotspotOut, RiskScoreOut,
    SignupRequest, LoginRequest, AuthResponse,
)
from data_loader import get_hotspots_df
from risk_model import compute_risk_scores, apply_rainfall_override
from auth_utils import hash_password, verify_password, generate_token

# Creates the citizen_reports table in hydrorisk.db if it doesn't exist yet.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HydroRisk API",
    description="Backend for Hyderabad flood/waterlogging risk intelligence",
    version="1.0",
)

# CORS: allows Farheen's frontend (running on a different port, e.g. React's
# localhost:3000) to call this API from the browser. Wide open ("*") is fine
# for a hackathon demo - you'd lock this down for a real production app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "HydroRisk API is running. Visit /docs for interactive API testing."}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/hotspots", response_model=List[HotspotOut])
def list_hotspots():
    """Static hotspot data - location, severity, elevation. For the map layer."""
    df = get_hotspots_df()
    return df.to_dict(orient="records")


@app.get("/hotspots/{hotspot_id}")
def get_hotspot(hotspot_id: str):
    df = get_hotspots_df()
    row = df[df["hotspot_id"] == hotspot_id]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"Hotspot {hotspot_id} not found")
    return row.to_dict(orient="records")[0]


@app.get("/risk-scores", response_model=List[RiskScoreOut])
def get_risk_scores(
    rainfall_override_mm: Optional[float] = Query(
        None,
        description="For the live demo: override today's rainfall (mm) for ALL hotspots "
                    "to see risk scores react in real time, instead of using the actual forecast.",
    )
):
    """
    Risk score per hotspot, 0-100. Uses Umaima's trained model automatically
    once it's dropped into this folder (see risk_model.py) - until then,
    uses a transparent heuristic placeholder.
    """
    df = get_hotspots_df()
    if rainfall_override_mm is not None:
        df = apply_rainfall_override(df, rainfall_override_mm)
    scored = compute_risk_scores(df)
    return scored.to_dict(orient="records")


@app.post("/reports", response_model=CitizenReportOut)
def submit_report(report: CitizenReportCreate, db: Session = Depends(get_db)):
    """Citizen 'Report flooding here' submission - the live ground-truth feature."""
    valid_severities = {"Minor", "Major", "Critical"}
    if report.severity not in valid_severities:
        raise HTTPException(
            status_code=400,
            detail=f"severity must be one of {valid_severities}, got '{report.severity}'",
        )
    db_report = CitizenReport(
        latitude=report.latitude,
        longitude=report.longitude,
        severity=report.severity,
        description=report.description,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report


@app.get("/reports", response_model=List[CitizenReportOut])
def list_reports(db: Session = Depends(get_db)):
    """All citizen reports so far - for map pins and the 'growing dataset' counter."""
    return db.query(CitizenReport).order_by(CitizenReport.reported_at.desc()).all()


@app.get("/reports/count")
def count_reports(db: Session = Depends(get_db)):
    """Just the count - handy for a simple 'N reports so far' UI badge."""
    return {"count": db.query(CitizenReport).count()}


# ---------- Auth (for Farheen's signup/login screens) ----------

@app.post("/auth/signup", response_model=AuthResponse)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    """Creates a new account. Returns a token immediately - Farheen's
    frontend should store this (e.g. in memory or localStorage-equivalent
    on her side) and send it on later requests that need to know who's
    logged in."""
    if "@" not in payload.email:
        raise HTTPException(status_code=400, detail="Please provide a valid email address")

    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    pwd_hash, salt = hash_password(payload.password)
    token = generate_token()
    user = User(email=payload.email, password_hash=pwd_hash, password_salt=salt, auth_token=token)
    db.add(user)
    db.commit()
    db.refresh(user)

    return AuthResponse(token=token, user_id=user.id, email=user.email)


@app.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Verifies email+password, issues a fresh token. Logging in again
    replaces any previous token for that user (only one active session
    at a time - a deliberate simplification for the hackathon timeline)."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash, user.password_salt):
        # Deliberately vague error message (not "wrong password" specifically) -
        # standard security practice so attackers can't tell whether the
        # email exists at all.
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = generate_token()
    user.auth_token = token
    db.commit()

    return AuthResponse(token=token, user_id=user.id, email=user.email)
