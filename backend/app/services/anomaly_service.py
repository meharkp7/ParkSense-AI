import pandas as pd

from app.core.config import PCI_PATH


class AnomalyService:

    @staticmethod
    def get_anomalies():

        df = pd.read_pickle(
            PCI_PATH
        )

        grouped = (
            df.groupby(
                "location"
            )
            .size()
            .reset_index(
                name="violations"
            )
        )

        mean = grouped[
            "violations"
        ].mean()

        std = grouped[
            "violations"
        ].std()

        grouped[
            "z_score"
        ] = (
            grouped[
                "violations"
            ] - mean
        ) / std

        anomalies = grouped[
            grouped[
                "z_score"
            ] > 2
        ].sort_values(
            "z_score",
            ascending=False,
        )

        results = []

        for _, row in (
            anomalies
            .head(10)
            .iterrows()
        ):

            percent = int(
                (
                    row[
                        "violations"
                    ]
                    / mean
                    - 1
                )
                * 100
            )

            results.append({
                "location":
                    row[
                        "location"
                    ],
                "violations":
                    int(
                        row[
                            "violations"
                        ]
                    ),
                "z_score":
                    round(
                        row[
                            "z_score"
                        ],
                        2,
                    ),
                "increase":
                    percent,
                "message":
                    f"Violations are {percent}% above city average.",
            })

        return results