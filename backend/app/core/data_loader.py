from functools import lru_cache

import pandas as pd

from app.core.config import (
    HOTSPOT_DF_PATH,
    HOTSPOTS_PATH,
    PCI_PATH,
)


@lru_cache(maxsize=1)
def load_pci():
    return pd.read_pickle(PCI_PATH)


@lru_cache(maxsize=1)
def load_hotspot_df():
    return pd.read_pickle(HOTSPOT_DF_PATH)


@lru_cache(maxsize=1)
def load_hotspots():
    return pd.read_pickle(HOTSPOTS_PATH)
