from functools import lru_cache
import gc

import pandas as pd

from app.core.config import (
    HOTSPOTS_PATH,
    PCI_PATH,
)


@lru_cache(maxsize=1)
def load_pci():
    df = pd.read_pickle(
        PCI_PATH
    )

    slim = df[
        [
            "id",
            "location",
            "hour",
            "pci",
            "hotspot_id",
        ]
    ].copy()

    slim["id"] = slim[
        "id"
    ].astype("string")

    slim["location"] = slim[
        "location"
    ].fillna("Unknown")
    slim["location"] = slim[
        "location"
    ].astype("category")

    slim["hour"] = (
        slim["hour"]
        .fillna(0)
        .astype("int8")
    )

    slim["pci"] = slim[
        "pci"
    ].astype("float32")

    slim["hotspot_id"] = slim[
        "hotspot_id"
    ].astype("int32")

    del df
    gc.collect()

    return slim


@lru_cache(maxsize=1)
def load_hotspot_df():
    pci = load_pci()

    return pci[
        [
            "location",
            "hotspot_id",
        ]
    ].copy()


@lru_cache(maxsize=1)
def load_hotspots():
    return pd.read_pickle(HOTSPOTS_PATH)
