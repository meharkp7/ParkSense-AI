import pandas as pd

from app.core.config import PCI_PATH


class AnalyticsService:

    @staticmethod
    def get_top_roads(
        top_n: int = 20,
    ):

        df = pd.read_pickle(
            PCI_PATH
        )

        roads = (
            df.groupby(
                "location"
            )
            .agg(
                avg_pci=("pci", "mean"),
                violations=("pci", "size"),
            )
            .sort_values(
                "avg_pci",
                ascending=False,
            )
            .head(top_n)
            .reset_index()
        )

        return roads.to_dict(
            orient="records"
        )
    
    @staticmethod
    def get_pci_trend():

        df = pd.read_pickle(PCI_PATH)

        trend = (
            df.groupby("hour")
            .agg(
                avg_pci=("pci", "mean"),
                violations=("pci", "size"),
            )
            .reset_index()
            .sort_values("hour")
        )

        trend["avg_pci"] = (
            trend["avg_pci"]
            .round(3)
        )

        return trend.to_dict(
        orient="records"
    )