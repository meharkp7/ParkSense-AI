import pandas as pd

from app.core.config import PCI_PATH


class TimelineService:

    @staticmethod
    def get_timeline(
        location: str,
    ):

        df = pd.read_pickle(
            PCI_PATH
        )

        timeline = (
            df[
                df["location"]
                == location
            ]
            .groupby("hour")
            .agg(
                pci=("pci", "mean"),
            )
            .reset_index()
        )

        result = []

        for hour in range(24):

            row = timeline[
                timeline["hour"]
                == hour
            ]

            pci = (
                float(
                    row.iloc[0]["pci"]
                )
                if len(row)
                else 0
            )

            result.append(
                {
                    "hour": hour,
                    "pci": round(
                        pci,
                        3,
                    ),
                }
            )

        return result