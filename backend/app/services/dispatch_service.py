import json

from pathlib import Path

from app.core.config import BASE_DIR


OFFICERS_FILE = (
    Path(BASE_DIR)
    / "data"
    / "enforcement"
    / "officers.json"
)


class DispatchService:

    @staticmethod
    def load_officers():

        if not OFFICERS_FILE.exists():
            return []

        return json.loads(
            OFFICERS_FILE.read_text()
        )

    @staticmethod
    def save_officers(
        officers
    ):

        OFFICERS_FILE.write_text(
            json.dumps(
                officers,
                indent=2
            )
        )

    @staticmethod
    def assign_officer(
        location: str
    ):
        """
        Assign the least-loaded available officer.
        Uses workload balancing until
        real geospatial dispatch is added.
        """

        officers = (
            DispatchService
            .load_officers()
        )

        available = [
            officer
            for officer in officers
            if officer["available"]
        ]

        if not available:
            return None

        assigned = min(
            available,
            key=lambda officer: (
                officer["cases"],
                officer["id"]
            )
        )

        # Update workload
        for officer in officers:

            if (
                officer["id"]
                ==
                assigned["id"]
            ):

                officer["cases"] += 1

                # Optional:
                # mark unavailable after 3 active cases

                if (
                    officer["cases"]
                    >= 3
                ):
                    officer[
                        "available"
                    ] = False

                break

        DispatchService.save_officers(
            officers
        )

        return assigned

    @staticmethod
    def release_officer(
        officer_name: str
    ):
        """
        Called when an alert is resolved.
        Frees officer workload.
        """

        officers = (
            DispatchService
            .load_officers()
        )

        for officer in officers:

            if (
                officer["name"]
                ==
                officer_name
            ):

                officer["cases"] = max(
                    0,
                    officer["cases"] - 1
                )

                officer[
                    "available"
                ] = True

                break

        DispatchService.save_officers(
            officers
        )