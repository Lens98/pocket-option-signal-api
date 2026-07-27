from app.config.weights import Weights
from app.strategies.strategy_result import StrategyResult


class AdxStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        # ----------------------------------
        # ADX not available yet
        # ----------------------------------

        if indicators.adx is None:

            result.reasons.append(
                "ADX Not Available"
            )

            return result

        # ----------------------------------
        # Strong Trend
        # ----------------------------------

        if indicators.adx >= 35:

            result.bullish_score += Weights.ADX + 5

            result.bearish_score += Weights.ADX + 5

            result.reasons.append(
                "ADX Strong Trend"
            )

        elif indicators.adx >= 25:

            result.bullish_score += Weights.ADX

            result.bearish_score += Weights.ADX

            result.reasons.append(
                "ADX Moderate Trend"
            )

        else:

            result.reasons.append(
                "ADX Weak Trend"
            )

        return result