from app.strategies.strategy_result import StrategyResult
from app.config.settings import settings


class RsiStrategy:

    def analyze(self, indicators):

    result = StrategyResult()

    rsi = indicators.rsi

    # ----------------------------
    # Oversold
    # ----------------------------

    if rsi <= settings.RSI_OVERSOLD:

        result.trend = "BULLISH"

        result.bullish_score += 20

        result.reasons.append(
            "RSI Oversold"
        )

        if rsi <= 20:

            result.bullish_score += 5

            result.reasons.append(
                "Extreme Oversold"
            )

    # ----------------------------
    # Overbought
    # ----------------------------

    elif rsi >= settings.RSI_OVERBOUGHT:

        result.trend = "BEARISH"

        result.bearish_score += 20

        result.reasons.append(
            "RSI Overbought"
        )

        if rsi >= 80:

            result.bearish_score += 5

            result.reasons.append(
                "Extreme Overbought"
            )

    # ----------------------------
    # Bullish Momentum
    # ----------------------------

    elif rsi >= 55 and rsi < settings.RSI_OVERBOUGHT:

        result.trend = "BULLISH"

        result.bullish_score += 8

        result.reasons.append(
            "Bullish RSI Momentum"
        )

    # ----------------------------
    # Bearish Momentum
    # ----------------------------

    elif rsi <= 45 and rsi > settings.RSI_OVERSOLD:

        result.trend = "BEARISH"

        result.bearish_score += 8

        result.reasons.append(
            "Bearish RSI Momentum"
        )

    else:

        result.reasons.append(
            "RSI Neutral"
        )

    return result