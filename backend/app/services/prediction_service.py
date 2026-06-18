import numpy as np
import pandas as pd

from app.core.config import PCI_PATH


class PredictionService:

    @staticmethod
    def get_predictions():

        df = pd.read_pickle(PCI_PATH)

        forecast = (
            df.groupby(
                ["location", "hour"]
            )
            .agg(
                predicted_pci=(
                    "pci",
                    "mean",
                ),
                violations=(
                    "pci",
                    "size",
                ),
            )
            .reset_index()
        )

        # Better ranking:
        # High PCI + many violations

        forecast["score"] = (
            forecast["predicted_pci"]
            * np.log1p(
                forecast["violations"]
            )
        )

        forecast = forecast.sort_values(
            "score",
            ascending=False,
        )

        results = []

        used_locations = set()

        for _, row in forecast.iterrows():

            location = row["location"]

            if location in used_locations:
                continue

            used_locations.add(
                location
            )

            pci = float(
                row["predicted_pci"]
            )

            violations = int(
                row["violations"]
            )

            hour = int(
                row["hour"]
            )

            # Clean name for dropdown
            display_name = (
                location.split(",")[0]
            )

            # Dynamic risk logic

            risk_score = (
                0.7 * pci +
                0.3 * min(
                    violations / 500,
                    1
                )
            )

            if risk_score >= 0.90:
                risk = "CRITICAL"
            elif risk_score >= 0.75:
                risk = "HIGH"
            elif risk_score >= 0.55:
                risk = "MEDIUM"
            else:
                risk = "LOW"

            tow_units = max(
                1,
                min(
                    8,
                    round(
                        violations / 200
                    )
                )
            )

            recommendation = {
                "CRITICAL":
                    f"Deploy {tow_units} tow vehicles before peak hour.",
                "HIGH":
                    "Increase enforcement patrols.",
                "MEDIUM":
                    "Issue parking alerts.",
                "LOW":
                    "Continue monitoring.",
            }[risk]

            results.append(
                {
                    "location":
                        location,

                    "display_name":
                        display_name,

                    "peak_hour":
                        f"{hour}:00",

                    "predicted_pci":
                        round(
                            pci,
                            3,
                        ),

                    "violations":
                        violations,

                    "risk":
                        risk,

                    "recommended_action":
                        recommendation,

                    "tow_units":
                        tow_units,
                }
            )

            if len(results) == 20:
                break

        return results