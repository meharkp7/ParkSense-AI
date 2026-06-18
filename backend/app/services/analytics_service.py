from app.core.data_loader import load_pci


class AnalyticsService:

    @staticmethod
    def get_top_roads(
        top_n: int = 20,
    ) -> list[dict]:

        df = load_pci()

        roads = (
            df.groupby(
                "location"
            )
            .agg(
                avg_pci=("pci", "mean"),
                violations=("pci", "size"),
            )
            .sort_values(
                "avg_pci",
                ascending=False,
            )
            .head(top_n)
            .reset_index()
        )

        roads["avg_pci"] = (
            roads["avg_pci"]
            .round(3)
        )

        return roads.to_dict(
            orient="records"
        )

    @staticmethod
    def get_pci_trend() -> list[dict]:

        df = load_pci()

        trend = (
            df.groupby("hour")
            .agg(
                avg_pci=("pci", "mean"),
                violations=("pci", "size"),
            )
            .reset_index()
            .sort_values("hour")
        )

        trend["avg_pci"] = (
            trend["avg_pci"]
            .round(3)
        )

        return trend.to_dict(
            orient="records"
        )
