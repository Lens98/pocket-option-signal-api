from app.market_data.csv_loader import CsvLoader
from app.models.market import MarketData


class HistoricalLoader:

    def load(self, filepath, asset="EUR/USD", timeframe="1m"):

        candles = CsvLoader().load(filepath)

        return MarketData(

            asset=asset,

            timeframe=timeframe,

            candles=candles

        )