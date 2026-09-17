"""
Database table definitions.

Right now there's just one table: citizen flood reports. This is the
"Report flooding here" feature from your project brief - it's how the
system builds its own growing labeled dataset over time, instead of
relying only on the ~3 historical events for validation.
"""

from sqlalchemy import Column, Integer, Float, String, DateTime
from sqlalchemy.sql import func
from database import Base


class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    severity = Column(String, nullable=False)   # e.g. "Minor", "Major", "Critical" - citizen's own assessment
    description = Column(String, nullable=True)  # optional free-text, e.g. "ankle-deep water near bus stop"
    reported_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    """
    For Farheen's signup/login screens. Kept intentionally simple for a
    hackathon timeline: one active login token per user (a new login
    overwrites the old one), no token expiry, no email verification.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    password_salt = Column(String, nullable=False)
    auth_token = Column(String, nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
