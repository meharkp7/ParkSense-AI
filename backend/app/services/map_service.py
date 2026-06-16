from functools import lru_cache

import pandas as pd

from app.core.config import (
    HOTSPOTS_PATH
)


@lru_cache(maxsize=1)
def load_hotspots():

    return pd.read_pickle(
        HOTSPOTS_PATH
    )


class MapService:

    @staticmethod
    def get_hotspots() -> list[dict]:

        hotspots = load_hotspots()

        hotspots = (
            hotspots
            .reset_index()
        )

        return hotspots.to_dict(
            orient="records"
        )