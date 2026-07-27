from app.strategies.strategy_result import StrategyResult
from app.config.settings import settings
from app.config.weights import Weights


class RsiStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        rsi = indicators.rsi

        # ----------------------------
        # Oversold
        # ----------------------------

        if rsi <= settings.RSI_OVERSOLD:

            result.trend = "BULLISH"

            result.bullish_score += Weights.RSI

            result.reasons.append(
                "RSI Oversold"
            )

            if rsi <= 20:

                result.bullish_score += 5

                result.reasons.append(
                    "Strong RSI Reversal"
                )

        # ----------------------------
        # Overbought
        # ----------------------------

        elif rsi >= settings.RSI_OVERBOUGHT:

            result.trend = "BEARISH"

            result.bearish_score += Weights.RSI

            result.reasons.append(
                "RSI Overbought"
            )

            if rsi >= 80:

                result.bearish_score += 5

                result.reasons.append(
                    "Strong RSI Reversal"
                )

        # ----------------------------
        # Neutral
        # ----------------------------

        else:

            result.reasons.append(
                "RSI Neutral"
            )

        return result