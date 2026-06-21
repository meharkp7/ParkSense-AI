"""
Anomaly Detection Service — temporal-aware z-score.

Detects genuine PCI spikes per (location × hour) rather than on raw
total violation counts, so predictably-busy locations aren't flagged.
"""
from app.core.data_loader import load_pci


class AnomalyService:

    @staticmethod
    def get_anomalies():
        df = load_pci()

        # ── 1. Build (location × hour) baseline ──────────────────────────────
        baseline = (
            df.groupby(["location", "hour"], observed=True)["pci"]
            .agg(mean_pci="mean", std_pci="std")
            .reset_index()
        )
        baseline["std_pci"] = baseline["std_pci"].fillna(0.01).clip(lower=0.01)

        # ── 2. Merge and compute z-scores ────────────────────────────────────
        merged = df.merge(baseline, on=["location", "hour"], how="left")
        merged["z_score"] = (merged["pci"] - merged["mean_pci"]) / merged["std_pci"]

        # ── 3. Per-location: max z-score and the hour where it occurs ─────────
        # Use a simpler groupby to avoid index-alignment issues
        loc_z = (
            merged.groupby("location", observed=True)["z_score"]
            .max()
            .reset_index()
            .rename(columns={"z_score": "max_z"})
        )

        # For each location get the hour that produced max z-score
        idx_max = merged.groupby("location", observed=True)["z_score"].idxmax()
        peak_hours = merged.loc[idx_max, ["location", "hour"]].set_index("location")["hour"]

        loc_z["peak_hour"] = loc_z["location"].map(peak_hours).fillna(0).astype(int)

        # Violation count and avg PCI per location
        loc_stats = (
            df.groupby("location", observed=True)["pci"]
            .agg(violations="count", avg_pci="mean")
            .reset_index()
        )

        result_df = loc_z.merge(loc_stats, on="location", how="left")
        anomalies = (
            result_df[result_df["max_z"] > 2.0]
            .sort_values("max_z", ascending=False)
            .head(10)
        )

        # ── 4. Format results ─────────────────────────────────────────────────
        city_mean_pci = float(df["pci"].mean())
        results = []
        for _, row in anomalies.iterrows():
            avg  = float(row["avg_pci"])
            z    = float(row["max_z"])
            peak = int(row["peak_hour"])
            pct  = int((avg / city_mean_pci - 1) * 100) if city_mean_pci > 0 else 0
            results.append({
                "location":   str(row["location"]),
                "violations": int(row["violations"]),
                "z_score":    round(z, 2),
                "avg_pci":    round(avg, 3),
                "peak_hour":  peak,
                "increase":   pct,
                "message": (
                    f"Anomalous spike at {peak:02d}:00 — "
                    f"PCI {pct}% above city average (z={z:.1f})."
                ),
            })
        return results