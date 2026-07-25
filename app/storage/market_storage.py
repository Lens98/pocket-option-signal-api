from app.models.market import MarketData


class MarketStorage:

    def __init__(self):

        self.market = None

    def update(self, market: MarketData):

        self.market = market

    def get(self):

        return self.market