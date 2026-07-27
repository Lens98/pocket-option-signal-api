from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class AtrStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        atr = indicators.atr

        # ----------------------------------------
        # ATR Not Available Yet
        # ----------------------------------------

        if atr is None:

            result.reasons.append(
                "ATR unavailable"
            )

            return result

        # ----------------------------------------
        # High Volatility
        # ----------------------------------------

        if atr >= 1.5:

            result.bullish_score = 20
            result.bearish_score = 20

            result.reasons.append(
                f"ATR High ({atr:.5f})"
            )

        # ----------------------------------------
        # Normal Volatility
        # ----------------------------------------

        elif atr >= 0.8:

            result.bullish_score = Weights.ATR
            result.bearish_score = Weights.ATR

            result.reasons.append(
                f"ATR Normal ({atr:.5f})"
            )

        # ----------------------------------------
        # Low Volatility
        # ----------------------------------------

        else:

            result.reasons.append(
                f"ATR Low ({atr:.5f})"
            )

        return result