from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN


@dataclass(frozen=True)
class DBSCANConfig:
    eps_meters: float = 50.0
    min_samples: int = 20


class HotspotDetector:

    EARTH_RADIUS = 6371000  # meters

    def __init__(
        self,
        config: DBSCANConfig = DBSCANConfig()
    ):
        self.config = config

    def detect(
        self,
        df: pd.DataFrame,
        lat_col: str = "latitude",
        lon_col: str = "longitude"
    ) -> pd.DataFrame:

        coords = np.radians(
            df[[lat_col, lon_col]].values
        )

        dbscan = DBSCAN(
            eps=(
                self.config.eps_meters
                / self.EARTH_RADIUS
            ),
            min_samples=self.config.min_samples,
            metric="haversine",
            algorithm="ball_tree"
        )

        labels = dbscan.fit_predict(coords)

        result = df.copy()

        result["hotspot_id"] = labels

        return result