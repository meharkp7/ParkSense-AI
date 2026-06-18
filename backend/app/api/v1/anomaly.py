from fastapi import APIRouter

from app.services.anomaly_service import (
    AnomalyService,
)

router = APIRouter()


@router.get(
    "/anomalies"
)
def get_anomalies():

    return (
        AnomalyService
        .get_anomalies()
    )


@router.get(
    "/anomaly/detect"
)
def detect_anomalies():
    anomalies = (
        AnomalyService
        .get_anomalies()
    )

    results = []

    for anomaly in anomalies:
        increase = anomaly.get(
            "increase",
            0,
        )

        if increase >= 100:
            severity = "HIGH"
        elif increase >= 50:
            severity = "MEDIUM"
        else:
            severity = "LOW"

        results.append(
            {
                "location": anomaly["location"],
                "severity": severity,
                "reason": anomaly["message"],
                "z_score": anomaly["z_score"],
                "violations": anomaly["violations"],
            }
        )

    return results
