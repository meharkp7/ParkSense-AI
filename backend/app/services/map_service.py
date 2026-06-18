from app.core.data_loader import (
    load_hotspot_df,
    load_hotspots,
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
