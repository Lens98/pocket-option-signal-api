from app.config.weights import Weights
from app.strategies.strategy_result import StrategyResult


class EmaStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        ema20 = indicators.ema20
        ema50 = indicators.ema50
        ema200 = indicators.ema200
        mode = indicators.mode

        print("----------------------------------------")
        print("EMA Strategy")
        print("----------------------------------------")
        print("Mode :", mode)
        print("EMA20 :", ema20)
        print("EMA50 :", ema50)
        print("EMA200:", ema200)

        # ========================================
        # STARTUP MODE
        # EMA20 only
        # ========================================

        if mode == "STARTUP":

            if ema20 is not None:

                result.reasons.append(
                    "Startup EMA20 Available"
                )

            return result

        # ========================================
        # STANDARD MODE
        # EMA20 vs EMA50
        # ========================================

        if mode == "STANDARD":

            if ema20 is not None and ema50 is not None:

                if ema20 > ema50:

                    result.trend = "BULLISH"
                    result.bullish_score += Weights.EMA

                    result.reasons.append(
                        "EMA20 Above EMA50"
                    )

                elif ema20 < ema50:

                    result.trend = "BEARISH"
                    result.bearish_score += Weights.EMA

                    result.reasons.append(
                        "EMA20 Below EMA50"
                    )

                else:

                    result.reasons.append(
                        "EMA Flat"
                    )

            return result

        # ========================================
        # ADVANCED MODE
        # EMA20 vs EMA50
        # ========================================

        if mode == "ADVANCED":

            if ema20 is not None and ema50 is not None:

                if ema20 > ema50:

                    result.trend = "BULLISH"
                    result.bullish_score += Weights.EMA

                    result.reasons.append(
                        "EMA Bullish"
                    )

                elif ema20 < ema50:

                    result.trend = "BEARISH"
                    result.bearish_score += Weights.EMA

                    result.reasons.append(
                        "EMA Bearish"
                    )

            return result

        # ========================================
        # FULL MODE
        # EMA20 > EMA50 > EMA200
        # ========================================

        if (

            ema20 is not None
            and
            ema50 is not None
            and
            ema200 is not None

        ):

            # Bullish

            if ema20 > ema50 > ema200:

                result.trend = "BULLISH"

                result.bullish_score += Weights.EMA

                result.reasons.append(
                    "EMA Bullish Alignment"
                )

                spread = ema20 - ema200

                if spread > 0.0010:

                    result.bullish_score += 5

                    result.reasons.append(
                        "Strong EMA Separation"
                    )

                elif spread > 0.0005:

                    result.bullish_score += 2

                    result.reasons.append(
                        "Moderate EMA Separation"
                    )

            # Bearish

            elif ema20 < ema50 < ema200:

                result.trend = "BEARISH"

                result.bearish_score += Weights.EMA

                result.reasons.append(
                    "EMA Bearish Alignment"
                )

                spread = ema200 - ema20

                if spread > 0.0010:

                    result.bearish_score += 5

                    result.reasons.append(
                        "Strong EMA Separation"
                    )

                elif spread > 0.0005:

                    result.bearish_score += 2

                    result.reasons.append(
                        "Moderate EMA Separation"
                    )

            else:

                result.reasons.append(
                    "EMA Mixed Alignment"
                )

        return result