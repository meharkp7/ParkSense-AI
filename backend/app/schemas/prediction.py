from pydantic import BaseModel


class PredictionResponse(BaseModel):

    location: str

    display_name: str

    peak_hour: str

    predicted_pci: float

    violations: int

    risk: str

    recommended_action: str

    tow_units: int