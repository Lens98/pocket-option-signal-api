from app.services.indicator_service import IndicatorService


class TrendAnalyzer:

    def __init__(self):
        self.indicators = IndicatorService()

    def analyze(self, market):

        # Not enough candles for EMA200
        if len(market.candles) < 200:
            return "SIDEWAYS"

        try:
            indicator = self.indicators.calculate(market)
        except ValueError:
            return "SIDEWAYS"

        ema20 = indicator.ema20
        ema50 = indicator.ema50
        ema200 = indicator.ema200

        if ema20 > ema50 > ema200:
            return "BULLISH"

        if ema20 < ema50 < ema200:
            return "BEARISH"

        if ema20 > ema50 and ema20 > ema200:
            return "BULLISH"

        if ema20 < ema50 and ema20 < ema200:
            return "BEARISH"

        return "SIDEWAYS"