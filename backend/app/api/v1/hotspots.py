from fastapi import APIRouter

from app.core.data_loader import load_hotspots

router = APIRouter()


@router.get("/hotspots/top")
def top_hotspots():

    hotspots = load_hotspots()

    hotspots = hotspots.reset_index()

    top = (
        hotspots
        .sort_values(
            "violations",
            ascending=False,
        )
        .head(5)
    )

    return top.to_dict(
        orient="records"
    )
