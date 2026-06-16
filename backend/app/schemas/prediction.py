from pydantic import BaseModel

class PredictionResponse(BaseModel):
    location: str
    predicted_pci: float
    risk: str
    recommended_action: str