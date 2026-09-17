"""
Loads hotspots_MASTER_COMBINED.csv into memory once when the API starts.
This is the file Zeba's data pipeline produced - keeping it as an in-memory
pandas DataFrame is simplest for a hackathon (no need to also load this
into a database table; it doesn't change during the demo, unlike citizen
reports which do need a real database).
"""

import pandas as pd

HOTSPOTS_FILE = "hotspots_MASTER_COMBINED.csv"

_hotspots_df = None


def get_hotspots_df() -> pd.DataFrame:
    global _hotspots_df
    if _hotspots_df is None:
        _hotspots_df = pd.read_csv(HOTSPOTS_FILE)
        _hotspots_df = _hotspots_df.astype(object).where(pd.notna(_hotspots_df), None)
        print(f"[data_loader] Loaded {len(_hotspots_df)} hotspots from {HOTSPOTS_FILE}")
    return _hotspots_df
