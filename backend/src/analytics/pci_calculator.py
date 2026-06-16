import pandas as pd


VIOLATION_WEIGHTS = {

    "NO PARKING": 0.50,

    "WRONG PARKING": 0.60,

    "PARKING ON FOOTPATH": 0.80,

    "DOUBLE PARKING": 0.90,

    "PARKING IN A MAIN ROAD": 1.00,

    "PARKING NEAR ROAD CROSSING": 1.00,

    "PARKING NEAR TRAFFIC LIGHT OR ZEBRA CROSS": 1.00,

    "PARKING NEAR BUSTOP/SCHOOL/HOSPITAL ETC": 0.95,

    "PARKING OTHER THAN BUS STOP": 0.75,

    "PARKING OPPOSITE TO ANOTHER PARKED VEHICLE": 0.85,
}


class PCICalculator:

    @staticmethod
    def temporal_score(hour: int) -> float:

        if 6 <= hour <= 10:
            return 1.0

        if 16 <= hour <= 21:
            return 1.0

        if 10 <= hour <= 16:
            return 0.7

        return 0.4

    @staticmethod
    def violation_score(
        violations: list[str]
    ) -> float:

        scores = []

        for violation in violations:

            score = VIOLATION_WEIGHTS.get(
                violation.upper(),
                0.5
            )

            scores.append(score)

        return max(scores)

    @staticmethod
    def compute_pci(
        row: pd.Series
    ) -> float:

        return round(

            0.35 * row["violation_score"]

            + 0.30 * row["hotspot_score"]

            + 0.20 * row["road_criticality"]

            + 0.15 * row["temporal_score"],

            3
        )