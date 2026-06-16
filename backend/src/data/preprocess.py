from dataclasses import dataclass

import pandas as pd


@dataclass(frozen=True)
class RequiredColumns:

    LATITUDE: str = "latitude"
    LONGITUDE: str = "longitude"
    DATETIME: str = "created_datetime"
    VIOLATION: str = "violation_type"
    LOCATION: str = "location"


REQUIRED_COLUMNS = [
    RequiredColumns.LATITUDE,
    RequiredColumns.LONGITUDE,
    RequiredColumns.DATETIME,
    RequiredColumns.VIOLATION,
    RequiredColumns.LOCATION,
]


class DataPreprocessor:

    @staticmethod
    def validate_schema(
        df: pd.DataFrame
    ) -> None:

        missing = (
            set(REQUIRED_COLUMNS)
            - set(df.columns)
        )

        if missing:
            raise ValueError(
                f"Missing columns: {missing}"
            )

    @staticmethod
    def remove_invalid_coordinates(
        df: pd.DataFrame
    ) -> pd.DataFrame:

        df = df[
            df["latitude"].between(-90, 90)
            &
            df["longitude"].between(-180, 180)
        ]

        return df

    @staticmethod
    def remove_missing_locations(
        df: pd.DataFrame
    ) -> pd.DataFrame:

        df = df.dropna(
            subset=["location"]
        )

        return df