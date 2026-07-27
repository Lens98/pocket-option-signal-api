from app.strategies.strategy_result import StrategyResult
from app.indicators.candle_patterns import CandlePatternDetector


class CandlestickStrategy:

    def analyze(self, market):

        detector = CandlePatternDetector()

        patterns = detector.detect(
            market.candles
        )

        result = StrategyResult()

        if not patterns:

            result.reasons.append(
                "No Candlestick Pattern"
            )

            return result

        for pattern in patterns:

            result.reasons.append(
                pattern.name
            )

            if pattern.bullish:

                result.trend = "BULLISH"

                result.bullish_score += pattern.strength

            elif pattern.bearish:

                result.trend = "BEARISH"

                result.bearish_score += pattern.strength

        return result