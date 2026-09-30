from app.strategies.strategy_result import StrategyResult
from app.config.settings import settings
from app.config.weights import Weights


class RsiStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        rsi = indicators.rsi

        # ----------------------------------------
        # RSI Not Available
        # ----------------------------------------

        if rsi is None:

            result.reasons.append(
                "RSI unavailable"
            )

            return result

        # ----------------------------------------
        # Strong Oversold
        # ----------------------------------------

        if rsi <= 20:

            result.trend = "BULLISH"

            result.bullish_score += Weights.RSI + 5

            result.reasons.append(
                "Strong RSI Oversold"
            )

        # ----------------------------------------
        # Oversold
        # ----------------------------------------

        elif rsi <= settings.RSI_OVERSOLD:

            result.trend = "BULLISH"

            result.bullish_score += Weights.RSI

            result.reasons.append(
                "RSI Oversold"
            )

        # ----------------------------------------
        # Bullish Momentum
        # ----------------------------------------

        elif 50 <= rsi < settings.RSI_OVERBOUGHT:

            result.trend = "BULLISH"

            result.bullish_score += 5

            result.reasons.append(
                "Bullish RSI Momentum"
            )

        # ----------------------------------------
        # Strong Overbought
        # ----------------------------------------

        elif rsi >= 80:

            result.trend = "BEARISH"

            result.bearish_score += Weights.RSI + 5

            result.reasons.append(
                "Strong RSI Overbought"
            )

        # ----------------------------------------
        # Overbought
        # ----------------------------------------

        elif rsi >= settings.RSI_OVERBOUGHT:

            result.trend = "BEARISH"

            result.bearish_score += Weights.RSI

            result.reasons.append(
                "RSI Overbought"
            )

        # ----------------------------------------
        # Bearish Momentum
        # ----------------------------------------

        elif 30 < rsi < 50:

            result.trend = "BEARISH"

            result.bearish_score += 5

            result.reasons.append(
                "Bearish RSI Momentum"
            )

        # ----------------------------------------
        # Neutral
        # ----------------------------------------

        else:

            result.reasons.append(
                "RSI Neutral"
            )

        return result