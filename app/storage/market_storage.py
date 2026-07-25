from app.models.market import MarketData


class MarketStorage:

    def __init__(self):

        self.markets = {}

    def update(self, market: MarketData):

        asset = market.asset

        if asset not in self.markets:

            self.markets[asset] = []

        history = self.markets[asset]

        # Existing candle timestamps
        existing = {
            candle.timestamp
            for candle in history
        }

        # Only add candles we don't already have
        for candle in market.candles:

            if candle.timestamp not in existing:

                history.append(candle)

        # Keep history ordered
        history.sort(
            key=lambda c: c.timestamp
        )

        # Keep only latest 500 candles
        self.markets[asset] = history[-500:]
        print("Stored History:", len(self.markets[asset]))

    def get(self, asset):

        history = self.markets.get(asset, [])

        return MarketData(
            asset=asset,
            timeframe="10",
            candles=history
        )

    def size(self, asset):

        return len(
            self.markets.get(asset, [])
        )