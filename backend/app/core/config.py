from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data" / "processed"

PCI_PATH = DATA_DIR / "final_pci_dataset.pkl"
HOTSPOTS_PATH = DATA_DIR / "hotspots.pkl"
HOTSPOT_DF_PATH = DATA_DIR / "hotspot_df.pkl"

API_V1_PREFIX = "/api/v1"

HIGH_RISK_THRESHOLD = 0.80