"""
Database setup for HydroRisk backend.

Uses SQLite - a database that lives in a single file on disk, no separate
server needed. Perfect for a hackathon project. If you ever need to switch
to PostgreSQL later (per your original tech stack), you'd only need to
change DATABASE_URL below - nothing else in the codebase changes, because
SQLAlchemy abstracts the actual database engine away.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./hydrorisk.db"

# check_same_thread=False is needed because FastAPI can handle multiple
# requests using different threads, and SQLite is picky about that by default.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """
    FastAPI dependency: gives each request its own database session,
    and guarantees it gets closed afterward even if an error happens.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
