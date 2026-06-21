from datetime import datetime

import joblib
import pandas as pd


MODEL = joblib.load(
    "models/pci_forecaster.pkl"
)

weekday_map = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}


class ForecastService:

    @staticmethod
    def predict_pci(
        hour: int,
        road_criticality: float = 0.8,
        target_datetime=None,
    ) -> float:

        now = (
            target_datetime
            if target_datetime
            else datetime.now()
        )

        row = pd.DataFrame([
            {
                "hour": hour,
                "day": now.day,
                "month": now.month,
                "is_weekend": int(
                    now.weekday() >= 5
                ),
                "road_criticality":
                    road_criticality,
                "weekday_num":
                    weekday_map[
                        now.strftime("%A")
                    ],
            }
        ])

        pred = MODEL.predict(
            row
        )[0]

        return max(
            0.0,
            min(
                1.0,
                float(pred)
            )
        )