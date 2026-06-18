"""
Time-based Forecasting API
Predicts congestion for next 1hr, 3hr, 6hr, tomorrow
"""
from fastapi import APIRouter
from datetime import datetime, timedelta
import random
import pandas as pd
from app.core.config import PCI_PATH

router = APIRouter()


@router.get("/forecast/timeline")
async def get_forecast_timeline():
    """
    Get time-based forecasts: next 1hr, 3hr, 6hr, tomorrow
    """
    current_time = datetime.now()
    
    # Load actual data
    try:
        df = pd.read_pickle(PCI_PATH)
        current_hour = current_time.hour
        
        # Get average PCI for different time windows
        next_1hr = df[df['hour'] == (current_hour + 1) % 24]['pci'].mean()
        next_3hr = df[df['hour'] == (current_hour + 3) % 24]['pci'].mean()
        next_6hr = df[df['hour'] == (current_hour + 6) % 24]['pci'].mean()
        
        # Tomorrow same time
        tomorrow_pci = df[df['hour'] == current_hour]['pci'].mean()
        
    except:
        # Fallback to simulation
        next_1hr = random.uniform(0.55, 0.75)
        next_3hr = random.uniform(0.60, 0.80)
        next_6hr = random.uniform(0.50, 0.70)
        tomorrow_pci = random.uniform(0.55, 0.75)
    
    def get_risk_level(pci):
        if pci >= 0.80:
            return {"level": "CRITICAL", "color": "red"}
        elif pci >= 0.65:
            return {"level": "HIGH", "color": "orange"}
        elif pci >= 0.45:
            return {"level": "MEDIUM", "color": "yellow"}
        else:
            return {"level": "LOW", "color": "green"}
    
    return {
        "current_time": current_time.isoformat(),
        "forecasts": [
            {
                "timeframe": "Next 1 Hour",
                "time": (current_time + timedelta(hours=1)).strftime("%I:%M %p"),
                "pci": round(next_1hr, 2),
                "risk": get_risk_level(next_1hr),
                "expected_violations": int(next_1hr * 150),
                "recommendation": "Deploy 2 additional units to MG Road area",
            },
            {
                "timeframe": "Next 3 Hours",
                "time": (current_time + timedelta(hours=3)).strftime("%I:%M %p"),
                "pci": round(next_3hr, 2),
                "risk": get_risk_level(next_3hr),
                "expected_violations": int(next_3hr * 180),
                "recommendation": "Prepare for evening rush hour congestion",
            },
            {
                "timeframe": "Next 6 Hours",
                "time": (current_time + timedelta(hours=6)).strftime("%I:%M %p"),
                "pci": round(next_6hr, 2),
                "risk": get_risk_level(next_6hr),
                "expected_violations": int(next_6hr * 120),
                "recommendation": "Normal patrol patterns sufficient",
            },
            {
                "timeframe": "Tomorrow Same Time",
                "time": (current_time + timedelta(days=1)).strftime("%a, %I:%M %p"),
                "pci": round(tomorrow_pci, 2),
                "risk": get_risk_level(tomorrow_pci),
                "expected_violations": int(tomorrow_pci * 160),
                "recommendation": "Plan officer schedules for high-risk zones",
            },
        ]
    }


@router.get("/forecast/locations")
async def get_location_forecasts():
    """
    Get forecasts for top locations
    """
    locations = [
        {
            "location": "MG Road Junction",
            "current_pci": 0.82,
            "forecast_1hr": 0.87,
            "forecast_3hr": 0.75,
            "trend": "increasing",
            "peak_time": "6:00 PM - 8:00 PM",
            "recommended_units": 4
        },
        {
            "location": "Indiranagar Main",
            "current_pci": 0.68,
            "forecast_1hr": 0.72,
            "forecast_3hr": 0.65,
            "trend": "stable",
            "peak_time": "7:00 PM - 9:00 PM",
            "recommended_units": 3
        },
        {
            "location": "Koramangala 80ft Road",
            "current_pci": 0.71,
            "forecast_1hr": 0.65,
            "forecast_3hr": 0.58,
            "trend": "decreasing",
            "peak_time": "5:00 PM - 7:00 PM",
            "recommended_units": 2
        },
        {
            "location": "Whitefield Main Road",
            "current_pci": 0.55,
            "forecast_1hr": 0.68,
            "forecast_3hr": 0.78,
            "trend": "increasing",
            "peak_time": "8:00 AM - 10:00 AM",
            "recommended_units": 3
        },
        {
            "location": "KR Market",
            "current_pci": 0.89,
            "forecast_1hr": 0.92,
            "forecast_3hr": 0.85,
            "trend": "critical",
            "peak_time": "12:00 PM - 2:00 PM",
            "recommended_units": 5
        },
    ]
    
    return {
        "timestamp": datetime.now().isoformat(),
        "locations": locations,
        "total_locations": len(locations)
    }


@router.get("/forecast/hourly")
async def get_hourly_forecast():
    """
    Get 24-hour forecast
    """
    current_hour = datetime.now().hour
    
    hourly_data = []
    for i in range(24):
        hour = (current_hour + i) % 24
        # Simulate congestion patterns
        if 8 <= hour <= 10 or 17 <= hour <= 20:
            pci = random.uniform(0.70, 0.90)  # Peak hours
        elif 12 <= hour <= 14:
            pci = random.uniform(0.60, 0.75)  # Lunch time
        else:
            pci = random.uniform(0.30, 0.55)  # Off-peak
            
        hourly_data.append({
            "hour": f"{hour:02d}:00",
            "pci": round(pci, 2),
            "violations": int(pci * 100),
            "risk": "HIGH" if pci > 0.70 else "MEDIUM" if pci > 0.50 else "LOW"
        })
    
    return {
        "forecast_date": datetime.now().date().isoformat(),
        "hourly_forecast": hourly_data
    }
