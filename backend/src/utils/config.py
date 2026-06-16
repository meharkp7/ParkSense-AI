from pathlib import Path
from dataclasses import dataclass


PROJECT_ROOT = Path(__file__).resolve().parents[2]


@dataclass(frozen=True)
class Config:
    RAW_DATA_DIR: Path = PROJECT_ROOT / "data" / "raw"
    PROCESSED_DATA_DIR: Path = PROJECT_ROOT / "data" / "processed"
    EXTERNAL_DATA_DIR: Path = PROJECT_ROOT / "data" / "external"

    LOG_DIR: Path = PROJECT_ROOT / "logs"
    MODEL_DIR: Path = PROJECT_ROOT / "models"

    RANDOM_STATE: int = 42


config = Config()

config.LOG_DIR.mkdir(exist_ok=True)
config.PROCESSED_DATA_DIR.mkdir(exist_ok=True)
config.MODEL_DIR.mkdir(exist_ok=True)