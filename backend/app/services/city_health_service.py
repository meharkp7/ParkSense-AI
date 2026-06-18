import pandas as pd

from app.core.config import PCI_PATH


class CityHealthService:

    @staticmethod
    def get_health():

        df = pd.read_pickle(
            PCI_PATH
        )

        avg_pci = float(
            df["pci"].mean()
        )

        total_violations = len(
            df
        )

        score = (
            100
            - avg_pci * 35
            - min(
                total_violations
                / 20000,
                15,
            )
        )

        score = max(
            0,
            round(score, 1),
        )

        if score >= 85:
            status = (
                "Excellent"
            )
            color = (
                "green"
            )

        elif score >= 70:
            status = (
                "Stable"
            )
            color = (
                "yellow"
            )

        else:
            status = (
                "Critical"
            )
            color = (
                "red"
            )

        return {
            "score": score,
            "status": status,
            "color": color,
            "avg_pci": round(
                avg_pci,
                3,
            ),
            "violations":
                total_violations,
        }