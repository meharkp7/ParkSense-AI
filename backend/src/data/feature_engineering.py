import ast
from typing import List

import numpy as np
import pandas as pd


class FeatureEngineer:

    @staticmethod
    def add_temporal_features(
        df: pd.DataFrame,
        datetime_col: str = "created_datetime"
    ) -> pd.DataFrame:

        df["hour"] = (
            df[datetime_col]
            .dt.hour
        )

        df["day"] = (
            df[datetime_col]
            .dt.day
        )

        df["month"] = (
            df[datetime_col]
            .dt.month
        )

        df["weekday"] = (
            df[datetime_col]
            .dt.day_name()
        )

        df["is_weekend"] = (
            df[datetime_col]
            .dt.weekday >= 5
        ).astype(int)

        return df

    @staticmethod
    def parse_violation_types(
        df: pd.DataFrame,
        column: str = "violation_type"
    ) -> pd.DataFrame:

        def safe_parse(x):

            if x is None:
                return []

            if isinstance(x, float) and pd.isna(x):
                return []

            if isinstance(
                x,
                (list, tuple, np.ndarray)
            ):
                return list(x)

            if isinstance(x, str):

                try:
                    return ast.literal_eval(x)

                except Exception:
                    return [x]

            return []

        df[column] = (
            df[column]
            .apply(safe_parse)
        )

        return df

    @staticmethod
    def add_violation_count(
        df: pd.DataFrame,
        column: str = "violation_type"
    ) -> pd.DataFrame:

        df["num_violations"] = (
            df[column]
            .apply(len)
        )

        return df

    @staticmethod
    def add_temporal_category(
        df: pd.DataFrame
    ) -> pd.DataFrame:

        def categorize(hour):

            if 6 <= hour < 10:
                return "morning_peak"

            elif 10 <= hour < 16:
                return "day"

            elif 16 <= hour < 21:
                return "evening_peak"

            return "night"

        df["time_category"] = (
            df["hour"]
            .apply(categorize)
        )

        return df