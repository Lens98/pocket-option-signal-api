from app.config.weights import Weights
from app.strategies.strategy_result import StrategyResult


class AdxStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        adx = indicators.adx

        # ========================================
        # ADX Not Available
        # ========================================

        if adx is None:

            result.reasons.append(
                "ADX Not Available"
            )

            return result

        # ========================================
        # Very Strong Trend
        # ========================================

        if adx >= 40:

            result.bullish_score += Weights.ADX + 5
            result.bearish_score += Weights.ADX + 5

            result.reasons.append(
                "Very Strong Trend (ADX)"
            )

        # ========================================
        # Strong Trend
        # ========================================

        elif adx >= 30:

            result.bullish_score += Weights.ADX + 2
            result.bearish_score += Weights.ADX + 2

            result.reasons.append(
                "Strong Trend (ADX)"
            )

        # ========================================
        # Moderate Trend
        # ========================================

        elif adx >= 25:

            result.bullish_score += Weights.ADX
            result.bearish_score += Weights.ADX

            result.reasons.append(
                "Moderate Trend (ADX)"
            )

        # ========================================
        # Weak Trend
        # ========================================

        elif adx >= 20:

            result.reasons.append(
                "Weak Trend (ADX)"
            )

        # ========================================
        # Sideways Market
        # ========================================

        else:

            result.reasons.append(
                "Sideways Market (ADX)"
            )

        return result