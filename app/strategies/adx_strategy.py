from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights

class AdxStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        # Strong trend
        if indicators.adx >= 25:

            # ADX confirms the existing trend
            if indicators.ema20 > indicators.ema50 > indicators.ema200:

                result.bullish_score = Weights.ADX
                result.trend = "BULLISH"

            elif indicators.ema20 < indicators.ema50 < indicators.ema200:

                result.bearish_score = Weights.ADX
                result.trend = "BEARISH"

            result.reasons.append(
                f"ADX Strong ({indicators.adx:.2f})"
            )

        # Weak trend
        else:

            result.reasons.append(
                f"ADX Weak ({indicators.adx:.2f})"
            )

        return result