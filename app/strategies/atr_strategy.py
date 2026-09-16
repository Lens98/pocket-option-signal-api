from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class AtrStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        atr = indicators.atr

        # ========================================
        # ATR Not Available
        # ========================================

        if atr is None:

            result.reasons.append(
                "ATR Not Available"
            )

            return result

        # ========================================
        # Very High Volatility
        # ========================================

        if atr >= 1.50:

            result.bullish_score += Weights.ATR + 2
            result.bearish_score += Weights.ATR + 2

            result.reasons.append(
                f"High Volatility ({atr:.5f})"
            )

        # ========================================
        # Healthy Volatility
        # ========================================

        elif atr >= 0.80:

            result.bullish_score += Weights.ATR
            result.bearish_score += Weights.ATR

            result.reasons.append(
                f"Healthy Volatility ({atr:.5f})"
            )

        # ========================================
        # Low Volatility
        # ========================================

        elif atr >= 0.40:

            result.reasons.append(
                f"Low Volatility ({atr:.5f})"
            )

        # ========================================
        # Dead Market
        # ========================================

        else:

            result.reasons.append(
                f"Very Low Volatility ({atr:.5f})"
            )

        return result