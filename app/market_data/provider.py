from app.market_data.historical_loader import HistoricalLoader


class MarketProvider:

    def historical(self, filepath):

        return HistoricalLoader().load(filepath)