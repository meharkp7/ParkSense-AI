from pydantic import BaseModel


class HotspotResponse(BaseModel):
    hotspot_id: int
    mean_lat: float
    mean_lon: float
    violations: int
    unique_locations: int