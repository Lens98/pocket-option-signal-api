from app.indicators.candle_patterns import CandlePatternDetector


class CandlestickStrategy:

    def analyze(self, market):

        detector = CandlePatternDetector()

        patterns = detector.detect(market.candles)

        score = 0

        reasons = []

        for pattern in patterns:

            score += pattern.strength

            reasons.append(pattern.name)

        return {
            "score": score,
            "reasons": reasons
        }