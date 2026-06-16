import pandas as pd

from app.core.config import HOTSPOTS_PATH


class MapService:

    @staticmethod
    def get_hotspots():

        hotspots = pd.read_pickle(
            HOTSPOTS_PATH
        )

        hotspots = hotspots.reset_index()

        return hotspots.to_dict(
            orient="records"
        )