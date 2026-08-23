import pandas as pd

from app.models.candle import Candle


class CsvLoader:

    def load(self, filepath):

        # Skip the extra Yahoo Finance header rows
        df = pd.read_csv(filepath, skiprows=3)

        # Rename columns
        df.columns = [
            "Datetime",
            "Adj Close",
            "Close",
            "High",
            "Low",
            "Open",
            "Volume"
        ]

        candles = []

        for _, row in df.iterrows():

            candles.append(
                Candle(
                    timestamp=str(row["Datetime"]),
                    open=float(row["Open"]),
                    high=float(row["High"]),
                    low=float(row["Low"]),
                    close=float(row["Close"]),
                    volume=float(row["Volume"])
                )
            )

        return candles