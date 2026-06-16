from functools import lru_cache

import pandas as pd

from app.core.config import (
    PCI_PATH,
    HOTSPOTS_PATH,
    HIGH_RISK_THRESHOLD,
)


@lru_cache(maxsize=1)
def load_pci_df():
    return pd.read_pickle(PCI_PATH)


@lru_cache(maxsize=1)
def load_hotspots_df():
    return pd.read_pickle(HOTSPOTS_PATH)


class DashboardService:

    @staticmethod
    def get_kpis() -> dict:

        df = load_pci_df()

        hotspots = load_hotspots_df()

        return {
            "total_violations": int(len(df)),

            "hotspots": int(
                len(hotspots)
            ),

            "avg_pci": round(
                float(
                    df["pci"].mean()
                ),
                3,
            ),

            "high_risk_zones": int(
                (
                    df["pci"]
                    >= HIGH_RISK_THRESHOLD
                ).sum()
            ),
        }