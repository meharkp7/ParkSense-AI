"""
ParkSense AI Copilot

LLM-powered parking intelligence assistant.

Flow:
1. Build context from real PCI dataset.
2. Query Groq LLM.
3. Fall back to fuzzy-match if LLM unavailable.
"""

import os
import json

from groq import Groq
from rapidfuzz import process

from app.core.data_loader import load_pci


_GROQ_API_KEY = os.getenv(
    "GROQ_API_KEY",
    ""
)

_MODEL = "llama-3.3-70b-versatile"


def _build_context(df) -> str:
    """
    Build compact dataset summary
    for LLM grounding.
    """

    top = (
        df.groupby(
            "location",
            observed=True
        )
        .agg(
            avg_pci=("pci", "mean"),
            violations=("pci", "count"),
        )
        .sort_values(
            "avg_pci",
            ascending=False
        )
        .head(20)
        .reset_index()
    )

    rows = []

    for _, row in top.iterrows():

        pci = float(
            row["avg_pci"]
        )

        risk = (
            "CRITICAL"
            if pci >= 0.90
            else "HIGH"
            if pci >= 0.80
            else "MEDIUM"
            if pci >= 0.65
            else "LOW"
        )

        rows.append(
            {
                "location":
                    str(row["location"]),

                "avg_pci":
                    round(pci, 3),

                "violations":
                    int(row["violations"]),

                "risk":
                    risk,
            }
        )

    hourly = (
        df.groupby(
            "hour",
            observed=True
        )["pci"]
        .mean()
        .round(3)
        .to_dict()
    )

    hourly_clean = {
        int(k): float(v)
        for k, v
        in hourly.items()
    }

    return json.dumps(
        {
            "top_locations":
                rows,

            "city_hourly_pci":
                hourly_clean,
        },
        indent=2,
    )


def _llm_answer(
    question: str,
    context: str,
) -> str:

    client = Groq(
        api_key=_GROQ_API_KEY
    )

    response = (
        client.chat.completions.create(
            model=_MODEL,
            temperature=0.2,
            messages=[
                {
                    "role":
                        "system",

                    "content":
                        (
                            "You are ParkSense Copilot, "
                            "an AI assistant for a smart "
                            "parking enforcement system.\n\n"
                            "Answer only using the "
                            "provided dataset context.\n"
                            "Do not invent statistics.\n"
                            "Provide actionable "
                            "recommendations."
                            "\n\n"
                            f"{context}"
                        ),
                },
                {
                    "role":
                        "user",

                    "content":
                        question,
                },
            ],
        )
    )

    return (
        response
        .choices[0]
        .message
        .content
        .strip()
    )


def _fuzzy_fallback(
    question: str,
    df,
) -> str:

    locations = (
        df["location"]
        .dropna()
        .unique()
    )

    result = process.extractOne(
        question.lower(),
        locations,
    )

    if (
        result is None
        or result[1] < 40
    ):
        return (
            "Location not found. "
            "Try mentioning a specific "
            "road or hotspot."
        )

    match, _, _ = result

    subset = df[
        df["location"] == match
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

    if avg_pci >= 0.90:

        risk = "CRITICAL"

        action = (
            "Deploy additional "
            "enforcement units "
            "immediately."
        )

    elif avg_pci >= 0.80:

        risk = "HIGH"

        action = (
            "Increase patrol "
            "coverage."
        )

    elif avg_pci >= 0.65:

        risk = "MEDIUM"

        action = (
            "Monitor traffic "
            "conditions closely."
        )

    else:

        risk = "LOW"

        action = (
            "Routine monitoring "
            "is sufficient."
        )

    return (
        f"📍 {match}\n\n"
        f"• Risk Level: {risk}\n"
        f"• PCI: {avg_pci:.2f}\n"
        f"• Peak Hour: {peak_hour:02d}:00\n"
        f"• Violations: {violations}\n\n"
        f"Recommendation: {action}"
    )


class CopilotService:

    @staticmethod
    async def answer(
        question: str
    ) -> dict:

        df = load_pci()

        if _GROQ_API_KEY:

            try:

                context = (
                    _build_context(df)
                )

                answer = (
                    _llm_answer(
                        question,
                        context,
                    )
                )

                return {
                    "answer":
                        answer,

                    "mode":
                        "llm",
                }

            except Exception as e:

                print(
                    f"[copilot] "
                    f"Groq failed: {e}"
                )

        answer = (
            _fuzzy_fallback(
                question,
                df,
            )
        )

        return {
            "answer":
                answer,

            "mode":
                "fuzzy_fallback",
        }