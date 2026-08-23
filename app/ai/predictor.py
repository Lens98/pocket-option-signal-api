from app.models.indicator import IndicatorResult


class Predictor:

    def confidence(self, indicators: IndicatorResult):

        score = 50

        if indicators.ema20 > indicators.ema50:
            score += 15

        if indicators.ema50 > indicators.ema200:
            score += 15

        if indicators.rsi < 30:
            score += 10

        if indicators.rsi > 70:
            score += 10

        if indicators.macd > 0:
            score += 10

        return min(score, 100)