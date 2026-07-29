from app.models.strategy_result import StrategyResult
from app.models.indicator import IndicatorResult


class EmaStrategy:

    def analyze(self, indicators: IndicatorResult) -> StrategyResult:

        result = StrategyResult(
            bullish_score=0,
            bearish_score=0,
            trend="SIDEWAYS",
            reasons=[]
        )

        # ========================================
        # STARTUP MODE
        # EMA20 only
        # ========================================

        if indicators.mode == "STARTUP":

            if indicators.ema20 is None:

                result.reasons.append("EMA20 Not Available")
                return result

            result.reasons.append("EMA20 Available")

            return result

        # ========================================
        # STANDARD / ADVANCED / FULL
        # EMA20 vs EMA50
        # ========================================

        if (
            indicators.ema20 is None
            or indicators.ema50 is None
        ):

            result.reasons.append("EMA Data Missing")
            return result

        # ----------------------------------------
        # Bullish Alignment
        # ----------------------------------------

        if indicators.ema20 > indicators.ema50:

            result.bullish_score = 25
            result.trend = "BULLISH"

            result.reasons.append(
                "EMA20 Above EMA50"
            )

        # ----------------------------------------
        # Bearish Alignment
        # ----------------------------------------

        elif indicators.ema20 < indicators.ema50:

            result.bearish_score = 25
            result.trend = "BEARISH"

            result.reasons.append(
                "EMA20 Below EMA50"
            )

        # ----------------------------------------
        # Sideways
        # ----------------------------------------

        else:

            result.reasons.append(
                "EMA20 Equals EMA50"
            )

        # ========================================
        # FULL MODE
        # EMA20 > EMA50 > EMA200
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