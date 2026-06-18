import pandas as pd

from app.core.config import PCI_PATH


class ResourceService:

    @staticmethod
    def get_resources():

        df = pd.read_pickle(
            PCI_PATH
        )

        grouped = (
            df.groupby("location")
            .agg(
                avg_pci=("pci", "mean"),
                violations=("id", "count"),
            )
            .reset_index()
            .sort_values(
                "avg_pci",
                ascending=False,
            )
        )

        top = grouped.iloc[0]

        pci = float(
            top["avg_pci"]
        )

        if pci >= 0.9:
            tow_units = 3
            officers = 6
            clearance = 15

        elif pci >= 0.8:
            tow_units = 2
            officers = 4
            clearance = 20

        else:
            tow_units = 1
            officers = 2
            clearance = 30

        return {
            "location":
                top["location"],
            "pci":
                round(pci, 2),
            "tow_units":
                tow_units,
            "officers":
                officers,
            "clearance_time":
                clearance,
        }