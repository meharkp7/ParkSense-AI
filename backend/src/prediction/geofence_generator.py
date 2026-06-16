import pandas as pd


class GeofenceGenerator:

    @staticmethod
    def generate(
        df: pd.DataFrame,
        threshold: float = 0.8
    ):

        return df[
            df["predicted_risk"] >= threshold
        ]