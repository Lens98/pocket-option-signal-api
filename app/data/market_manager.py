from app.models.market import MarketData


class MarketManager:

    def __init__(self, provider):

        self.provider = provider

    def load_market(
        self,
        asset,
        timeframe,
        limit=500
    ):

        candles = self.provider.get_candles(
            asset,
            timeframe,
            limit
        )

        return MarketData(

            asset=asset,

            timeframe=timeframe,

            candles=candles

        )