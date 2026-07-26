from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights

class MacdStrategy:

    def analyze(self, indicators):

    result = StrategyResult()

    macd = indicators.macd
    signal = indicators.signal_line

    histogram = macd - signal

    # --------------------------------
    # Bullish MACD
    # --------------------------------

    if macd > signal:

        result.trend = "BULLISH"

        result.bullish_score += Weights.MACD

        result.reasons.append(
            "MACD Bullish Cross"
        )

        if histogram > 0.0005:

            result.bullish_score += 5

            result.reasons.append(
                "Strong Bullish Momentum"
            )

        elif histogram > 0:

            result.bullish_score += 2

            result.reasons.append(
                "Bullish Momentum Building"
            )

    # --------------------------------
    # Bearish MACD
    # --------------------------------

    elif macd < signal:

        result.trend = "BEARISH"

        result.bearish_score += Weights.MACD

        result.reasons.append(
            "MACD Bearish Cross"
        )

        if histogram < -0.0005:

            result.bearish_score += 5

            result.reasons.append(
                "Strong Bearish Momentum"
            )

        elif histogram < 0:

            result.bearish_score += 2

            result.reasons.append(
                "Bearish Momentum Building"
            )

    else:

        result.reasons.append(
            "MACD Neutral"
        )

    return result