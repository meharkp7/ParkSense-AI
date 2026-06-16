import pandas as pd

from app.core.config import (
    PCI_PATH,
    HOTSPOTS_PATH,
)


class DashboardService:

    @staticmethod
    def get_kpis():

        df = pd.read_pickle(PCI_PATH)

        hotspots = pd.read_pickle(
            HOTSPOTS_PATH
        )

        return {
            "total_violations": len(df),

            "hotspots": len(
                hotspots
            ),

            "avg_pci": round(
                df["pci"].mean(),
                3,
            ),

            "high_risk_zones": int(
                (
                    df["pci"] >= 0.80
                ).sum()
            ),
        }