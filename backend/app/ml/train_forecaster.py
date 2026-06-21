import joblib
import pandas as pd

from xgboost import XGBRegressor

from app.core.config import PCI_PATH

print("Loading data...")

df = pd.read_pickle(
    PCI_PATH
)

# encode weekday
weekday_map = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}

df["weekday_num"] = (
    df["weekday"]
    .map(weekday_map)
)

features = [
    "hour",
    "day",
    "month",
    "is_weekend",
    "road_criticality",
    "weekday_num",
]

X = df[features]

y = df["pci"]

print("Training model...")

model = XGBRegressor(
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
)

model.fit(X, y)

joblib.dump(
    model,
    "models/pci_forecaster.pkl"
)

print("Model saved.")