import os
import yfinance as yf


class MarketDownloader:

    def download(
        self,
        symbol="EURUSD=X",
        period="7d",
        interval="1m"
    ):

        print("Downloading historical data...")

        data = yf.download(
            tickers=symbol,
            period=period,
            interval=interval,
            progress=False,
            auto_adjust=False
        )

        os.makedirs("app/market_data/sample_data", exist_ok=True)

        filename = "app/market_data/sample_data/EURUSD_M1.csv"

        data.to_csv(filename)

        print(f"\nSaved to: {filename}")

        return data