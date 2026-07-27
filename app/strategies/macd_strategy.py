from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class MacdStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        macd = indicators.macd
        signal = indicators.signal_line

        # ----------------------------
        # Bullish Cross
        # ----------------------------

        if macd > signal:

            result.trend = "BULLISH"

            result.bullish_score += Weights.MACD

            result.reasons.append(
                "MACD Bullish Cross"
            )

            strength = macd - signal

            if strength > 0.0005:

                result.bullish_score += 5

                result.reasons.append(
                    "Strong Bullish Momentum"
                )

            elif strength > 0.0002:

                result.bullish_score += 2

                result.reasons.append(
                    "Moderate Bullish Momentum"
                )

        # ----------------------------
        # Bearish Cross
        # ----------------------------

        elif macd < signal:

            result.trend = "BEARISH"

            result.bearish_score += Weights.MACD

            result.reasons.append(
                "MACD Bearish Cross"
            )

            strength = signal - macd

            if strength > 0.0005:

                result.bearish_score += 5

                result.reasons.append(
                    "Strong Bearish Momentum"
                )

            elif strength > 0.0002:

                result.bearish_score += 2

                result.reasons.append(
                    "Moderate Bearish Momentum"
                )

        else:

            result.reasons.append(
                "MACD Neutral"
            )

        return result