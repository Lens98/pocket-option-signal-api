from app.config.weights import Weights
from app.strategies.strategy_result import StrategyResult


class EmaStrategy:

    def analyze(self, indicators):

    result = StrategyResult()

    ema20 = indicators.ema20
    ema50 = indicators.ema50
    ema200 = indicators.ema200

    # ----------------------------
    # Bullish Alignment
    # ----------------------------

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

    # ----------------------------
    # Bearish Alignment
    # ----------------------------

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