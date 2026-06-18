import pandas as pd
from rapidfuzz import process

from app.core.config import PCI_PATH

class CopilotService:

    @staticmethod
    def answer(question: str):

        df = pd.read_pickle(
            PCI_PATH
        )

        question = (
            question.lower()
        )

        locations = (
            df["location"]
            .dropna()
            .unique()
        )

        result = (
            process.extractOne(
                question,
                locations,
            )
        )

        if result is None:
            return {
                "answer":
                "Location not found."
            }

        match, score, _ = result

        if score < 40:
            return {
                "answer":
                "Location not found."
            }

        subset = df[
            df["location"]
            == match
        ]

        avg_pci = float(
            subset["pci"].mean()
        )

        peak_hour = int(
            subset["hour"]
            .mode()[0]
        )

        violations = len(
            subset
        )

        if avg_pci >= 0.9:
            risk = "CRITICAL"
            action = (
                "Deploy 3 tow units and increase enforcement."
            )

        elif avg_pci >= 0.8:
            risk = "HIGH"
            action = (
                "Increase enforcement patrols."
            )

        elif avg_pci >= 0.7:
            risk = "MEDIUM"
            action = (
                "Issue parking alerts and monitor traffic."
            )

        else:
            risk = "LOW"
            action = (
                "Continue monitoring."
            )

        answer = f"""
📍 {match}

Current Status
• Risk Level: {risk}
• Congestion Index (PCI): {avg_pci:.2f}
• Peak Traffic Window: {peak_hour}:00
• Recorded Violations: {violations}

AI Analysis
This region demonstrates persistent parking pressure and congestion accumulation patterns. Historical trends indicate elevated activity during peak traffic periods.

Operational Recommendation
{action}
"""

        return {
            "answer":
            answer.strip()
        }