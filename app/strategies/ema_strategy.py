from app.strategies.strategy_result import StrategyResult
from app.models.indicator import IndicatorResult


class EmaStrategy:

    def analyze(self, indicators: IndicatorResult) -> StrategyResult:

        result = StrategyResult()

        # ========================================
        # STARTUP MODE (EMA20 Only)
        # ========================================

        if indicators.mode == "STARTUP":

            if indicators.ema20 is None:

                result.reasons.append(
                    "EMA20 Not Available"
                )

                return result

            # We can't compare EMA20 to EMA50 yet.
            # Give a small bullish score because the
            # Trend Analyzer already confirmed direction.

            result.trend = "BULLISH"

            result.bullish_score = 15

            result.reasons.append(
                "EMA20 Trend"
            )

            return result

        # ========================================
        # Need EMA20 + EMA50
        # ========================================

        if (
            indicators.ema20 is None
            or indicators.ema50 is None
        ):

            result.reasons.append(
                "EMA Data Missing"
            )

            return result

        # ========================================
        # EMA20 Above EMA50
        # ========================================

        if indicators.ema20 > indicators.ema50:

            result.trend = "BULLISH"

            result.bullish_score = 25

            result.reasons.append(
                "EMA20 Above EMA50"
            )

        # ========================================
        # EMA20 Below EMA50
        # ========================================

        elif indicators.ema20 < indicators.ema50:

            result.trend = "BEARISH"

            result.bearish_score = 25

            result.reasons.append(
                "EMA20 Below EMA50"
            )

        else:

            result.reasons.append(
                "EMA Flat"
            )

        # ========================================
        # FULL MODE
        # ========================================

        if (
            indicators.mode == "FULL"
            and indicators.ema200 is not None
        ):

            if (
                indicators.ema20 >
                indicators.ema50 >
                indicators.ema200
            ):

                result.bullish_score += 10

                result.reasons.append(
                    "EMA200 Bullish Alignment"
                )

            elif (
                indicators.ema20 <
                indicators.ema50 <
                indicators.ema200
            ):

                result.bearish_score += 10

                result.reasons.append(
                    "EMA200 Bearish Alignment"
                )

        return result