from app.strategies.strategy_result import StrategyResult
from app.indicators.candle_patterns import CandlePatternDetector


class CandlestickStrategy:

    def analyze(self, market):

    detector = CandlePatternDetector()

    patterns = detector.detect(market.candles)

    result = StrategyResult()

    if len(patterns) == 0:

        result.reasons.append(
            "No Candlestick Pattern"
        )

        return result

    for pattern in patterns:

        result.reasons.append(
            f"{pattern.name} ({pattern.strength})"
        )

        # ----------------------------
        # Bullish Pattern
        # ----------------------------

        if pattern.bullish:

            result.trend = "BULLISH"

            result.bullish_score += pattern.strength

            if pattern.strength >= 20:

                result.bullish_score += 5

                result.reasons.append(
                    "Strong Bullish Pattern"
                )

        # ----------------------------
        # Bearish Pattern
        # ----------------------------

        elif pattern.bearish:

            result.trend = "BEARISH"

            result.bearish_score += pattern.strength

            if pattern.strength >= 20:

                result.bearish_score += 5

                result.reasons.append(
                    "Strong Bearish Pattern"
                )

    return result