from dataclasses import dataclass

import pandas as pd


@dataclass(frozen=True)
class RoadKeywords:

    SCORES = {
        "JUNCTION": 1.00,
        "CIRCLE": 1.00,
        "METRO": 1.00,
        "SIGNAL": 0.95,
        "TRAFFIC LIGHT": 0.95,
        "HOSPITAL": 0.95,
        "SCHOOL": 0.90,
        "MARKET": 0.90,
        "BUS STOP": 0.85,
        "COLLEGE": 0.80,
        "MAIN ROAD": 0.80,
        "TECH PARK": 0.75,
        "RING ROAD": 0.75,
    }


class RoadCriticalityCalculator:

    @staticmethod
    def compute(location: str) -> float:

        if pd.isna(location):
            return 0.5

        location = location.upper()

        score = 0.5

        for keyword, value in RoadKeywords.SCORES.items():

            if keyword in location:
                score = max(score, value)

        return score