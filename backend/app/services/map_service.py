from functools import lru_cache

import pandas as pd

from app.core.config import (
    HOTSPOTS_PATH,
    HOTSPOT_DF_PATH,
)


@lru_cache(maxsize=1)
def load_hotspots():
    return pd.read_pickle(
        HOTSPOTS_PATH
    )


@lru_cache(maxsize=1)
def load_hotspot_df():
    return pd.read_pickle(
        HOTSPOT_DF_PATH
    )


class MapService:

    @staticmethod
    def get_hotspots() -> list[dict]:

        hotspots = (
            load_hotspots()
            .reset_index()
        )

        hotspot_df = (
            load_hotspot_df()
        )

        representative = (
            hotspot_df
            .groupby(
                "hotspot_id"
            )["location"]
            .agg(
                lambda x:
                x.mode().iloc[0]
                if len(
                    x.mode()
                )
                else x.iloc[0]
            )
            .reset_index()
            .rename(
                columns={
                    "location":
                    "top_location"
                }
            )
        )

        hotspots = hotspots.merge(
            representative,
            on="hotspot_id",
            how="left",
        )

        return hotspots.to_dict(
            orient="records"
        )