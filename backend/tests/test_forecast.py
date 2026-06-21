from app.services.forecast_service import (
    ForecastService
)


def test_forecast_range():

    pci = (
        ForecastService
        .predict_pci(10)
    )

    assert pci >= 0
    assert pci <= 1