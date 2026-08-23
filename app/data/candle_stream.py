class CandleStream:

    def __init__(self):

        self.candles = []

    def update(self, candles):

        self.candles = candles

    def latest(self):

        return self.candles

    def last(self):

        if not self.candles:
            return None

        return self.candles[-1]