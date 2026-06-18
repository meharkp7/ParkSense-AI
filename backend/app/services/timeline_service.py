from app.core.data_loader import load_pci


class TimelineService:

    @staticmethod
    def get_timeline(
        location: str,
    ):

        df = load_pci()

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
