import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error


class HotspotPredictor:

    def __init__(self):

        self.model = RandomForestRegressor(
            n_estimators=200,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )

    def train(
        self,
        X: pd.DataFrame,
        y: pd.Series
    ):

        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )

        self.model.fit(
            X_train,
            y_train
        )

        preds = self.model.predict(X_test)

        mae = mean_absolute_error(
            y_test,
            preds
        )

        print(f"MAE: {mae:.4f}")

        return self

    def predict(
        self,
        X: pd.DataFrame
    ):

        return self.model.predict(X)