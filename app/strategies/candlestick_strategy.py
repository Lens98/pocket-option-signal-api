from app.strategies.strategy_result import StrategyResult
from app.indicators.candle_patterns import CandlePatternDetector


class CandlestickStrategy:

    def __init__(self):

        self.detector = CandlePatternDetector()

    def analyze(self, market):

        result = StrategyResult()

        patterns = self.detector.detect(
            market.candles
        )

        # ----------------------------------------
        # No Pattern
        # ----------------------------------------

        if not patterns:

            result.reasons.append(
                "No Candlestick Pattern"
            )

            return result

        # ----------------------------------------
        # Process Patterns
        # ----------------------------------------

        strongest = 0

        for pattern in patterns:

            result.reasons.append(pattern.name)

            strength = max(
                1,
                min(pattern.strength, 10)
            )

            strongest = max(
                strongest,
                strength
            )

            if pattern.bullish:

                result.trend = "BULLISH"

                result.bullish_score += strength

            elif pattern.bearish:

                result.trend = "BEARISH"

                result.bearish_score += strength

        # ----------------------------------------
        # Bonus for Strong Pattern
        # ----------------------------------------

        if strongest >= 8:

            if result.trend == "BULLISH":

                result.bullish_score += 2

                result.reasons.append(
                    "Strong Bullish Pattern"
                )

            elif result.trend == "BEARISH":

                result.bearish_score += 2

                result.reasons.append(
                    "Strong Bearish Pattern"
                )

        return result