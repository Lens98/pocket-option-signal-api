from app.strategies.strategy_result import StrategyResult


class SupportStrategy:

    def analyze(self, levels):

        result = StrategyResult()

        # ----------------------------------------
        # Near Support
        # ----------------------------------------

        if levels.near_support:

            result.trend = "BULLISH"

            result.bullish_score += 15

            result.reasons.append(
                "Price Near Support"
            )

        # ----------------------------------------
        # Near Resistance
        # ----------------------------------------

        if levels.near_resistance:

            result.trend = "BEARISH"

            result.bearish_score += 15

            result.reasons.append(
                "Price Near Resistance"
            )

        return result