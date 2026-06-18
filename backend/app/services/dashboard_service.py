from app.core.config import (
    HIGH_RISK_THRESHOLD,
)
from app.core.data_loader import (
    load_hotspots,
    load_pci,
)


class DashboardService:

    @staticmethod
    def get_kpis() -> dict:

        df = load_pci()

        hotspots = load_hotspots()

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
