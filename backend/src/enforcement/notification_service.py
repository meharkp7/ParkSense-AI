class NotificationEngine:

    @staticmethod
    def generate_sms(
        vehicle_number: str,
        location: str
    ) -> str:

        return (
            f"Traffic Alert: Vehicle "
            f"{vehicle_number} is parked "
            f"in a congestion-sensitive zone "
            f"at {location}. "
            f"Please relocate within "
            f"10 minutes to avoid penalties."
        )