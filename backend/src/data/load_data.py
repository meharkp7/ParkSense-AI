from pathlib import Path

import pandas as pd

from src.utils.logger import logger


class DataLoader:
    """
    Handles dataset loading and basic ingestion operations.
    """

    def __init__(self, file_path: Path):
        self.file_path = file_path

    def load(self) -> pd.DataFrame:
        """
        Load CSV dataset.

        Returns:
            pd.DataFrame
        """
        logger.info(f"Loading dataset from {self.file_path}")

        if not self.file_path.exists():
            raise FileNotFoundError(
                f"{self.file_path} not found."
            )

        df = pd.read_csv(
            self.file_path,
            low_memory=False
        )

        logger.info(
            f"Loaded dataset with shape {df.shape}"
        )

        return df

    @staticmethod
    def remove_duplicates(
        df: pd.DataFrame
    ) -> pd.DataFrame:

        before = len(df)

        df = df.drop_duplicates()

        after = len(df)

        logger.info(
            f"Removed {before - after} duplicates."
        )

        return df

    @staticmethod
    def parse_datetime(
        df: pd.DataFrame,
        column: str = "created_datetime"
    ) -> pd.DataFrame:

        if column not in df.columns:
            raise ValueError(
                f"{column} not found in dataframe."
            )

        df[column] = pd.to_datetime(
            df[column],
            errors="coerce",
            utc=True
        )

        return df