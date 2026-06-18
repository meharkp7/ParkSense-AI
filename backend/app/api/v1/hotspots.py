from fastapi import APIRouter
import pandas as pd

from app.core.config import HOTSPOTS_PATH

router = APIRouter()


@router.get("/hotspots/top")
def top_hotspots():

    hotspots = pd.read_pickle(
        HOTSPOTS_PATH
    )

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