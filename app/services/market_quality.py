class MarketQuality:

    def calculate(self, signal):

        quality = 50

        # Trend
        if signal.trend in ["BULLISH", "BEARISH"]:
            quality += 15

        # Market Regime
        if signal.regime == "TREND":
            quality += 15

        elif signal.regime == "BREAKOUT":
            quality += 12

        elif signal.regime == "REVERSAL":
            quality += 8

        elif signal.regime == "RANGE":
            quality -= 10

        # Risk

        if signal.risk == "LOW":
            quality += 10

        elif signal.risk == "MEDIUM":
            quality += 5

        elif signal.risk == "HIGH":
            quality -= 15

        return max(0, min(quality, 100))