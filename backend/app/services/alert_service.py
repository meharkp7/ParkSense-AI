import random
from datetime import datetime

from app.core.data_loader import load_hotspot_df

class AlertService:

    @staticmethod
    def get_live_events():

        df = load_hotspot_df()

        recent = (
            df.groupby("location")
            .size()
            .reset_index(name="violations")
            .sort_values(
                "violations",
                ascending=False
            )
            .head(20)
        )

        events = []

        for _, row in recent.iterrows():

            severity = (
                "critical"
                if row["violations"] > 500
                else "warning"
                if row["violations"] > 200
                else "normal"
            )

            message = random.choice([
                "Illegal parking surge detected",
                "Congestion increasing",
                "High enforcement activity",
                "Traffic bottleneck observed",
                "Parking demand exceeded threshold",
            ])

            events.append({
                "location": row["location"],
                "message": (
                    f"{message} at "
                    f"{row['location'].split(',')[0]}"
                ),
                "severity": severity,
                "violations": int(
                    row["violations"]
                ),
                "time":
                    datetime.now().strftime(
                        "%H:%M"
                    ),
            })

        return events
