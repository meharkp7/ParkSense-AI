import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "backend" / ".env")

DATA_DIR = BASE_DIR / "data" / "processed"

PCI_PATH = DATA_DIR / "final_pci_dataset.pkl"
HOTSPOTS_PATH = DATA_DIR / "hotspots.pkl"
HOTSPOT_DF_PATH = DATA_DIR / "hotspot_df.pkl"

API_V1_PREFIX = "/api/v1"

HIGH_RISK_THRESHOLD = 0.80

PARKSENSE_ENV = os.getenv("PARKSENSE_ENV", "development")
ALLOW_SIMULATION_PROVIDERS = os.getenv("PARKSENSE_ALLOW_SIMULATION_PROVIDERS", "false").lower() == "true"

SMS_PROVIDER = os.getenv("PARKSENSE_SMS_PROVIDER", "disabled").lower()
CALL_PROVIDER = os.getenv("PARKSENSE_CALL_PROVIDER", "disabled").lower()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_SMS_FROM = os.getenv("TWILIO_SMS_FROM", "")
TWILIO_CALL_FROM = os.getenv("TWILIO_CALL_FROM", TWILIO_SMS_FROM)

MSG91_AUTH_KEY = os.getenv("MSG91_AUTH_KEY", "")
MSG91_SENDER_ID = os.getenv("MSG91_SENDER_ID", "")
MSG91_ROUTE = os.getenv("MSG91_ROUTE", "4")
MSG91_COUNTRY = os.getenv("MSG91_COUNTRY", "91")

FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY", "")
FAST2SMS_ROUTE = os.getenv("FAST2SMS_ROUTE", "q")
FAST2SMS_SENDER_ID = os.getenv("FAST2SMS_SENDER_ID", "")
