from pydantic import BaseModel


class KPIResponse(BaseModel):
    total_violations: int
    hotspots: int
    avg_pci: float
    high_risk_zones: int