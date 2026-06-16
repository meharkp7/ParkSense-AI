class PredictionService:

    @staticmethod
    def get_predictions():

        return [
            {
                "location": "KR Market",
                "predicted_pci": 0.92,
                "risk": "HIGH",
                "recommended_action":
                    "Deploy 2 tow vehicles",
            },

            {
                "location": "Majestic",
                "predicted_pci": 0.85,
                "risk": "HIGH",
                "recommended_action":
                    "Increase enforcement patrol",
            },

            {
                "location": "Koramangala",
                "predicted_pci": 0.68,
                "risk": "MEDIUM",
                "recommended_action":
                    "Issue parking alerts",
            },
        ]