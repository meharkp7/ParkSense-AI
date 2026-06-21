from app.services.dispatch_service import (
    DispatchService
)


def test_load_officers():

    officers = (
        DispatchService
        .load_officers()
    )

    assert len(officers) > 0