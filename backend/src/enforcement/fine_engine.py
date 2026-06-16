class FineEngine:

    BASE_FINE = 500

    @staticmethod
    def calculate(
        duration_minutes: int
    ) -> int:

        if duration_minutes <= 10:
            return 0

        if duration_minutes <= 20:
            return 500

        if duration_minutes <= 30:
            return 1000

        if duration_minutes <= 60:
            return 2000

        return 3000