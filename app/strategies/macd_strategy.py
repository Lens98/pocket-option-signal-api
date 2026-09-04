from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class MacdStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        macd = indicators.macd
        signal = indicators.signal_line
        histogram = indicators.histogram

        # ----------------------------------------
        # MACD Not Available
        # ----------------------------------------

        if macd is None or signal is None:

            result.reasons.append(
                "MACD unavailable"
            )

            return result

        # ----------------------------------------
        # Bullish
        # ----------------------------------------

        if macd > signal:

            result.trend = "BULLISH"

            result.bullish_score += Weights.MACD

            result.reasons.append(
                "MACD Above Signal"
            )

            # Histogram confirmation

            if histogram is not None:

                if histogram > 0:

                    result.bullish_score += 3

                    result.reasons.append(
                        "Bullish Histogram"
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

        # ----------------------------------------
        # Bearish
        # ----------------------------------------

        elif macd < signal:

            result.trend = "BEARISH"

            result.bearish_score += Weights.MACD

            result.reasons.append(
                "MACD Below Signal"
            )

            if histogram is not None:

                if histogram < 0:

                    result.bearish_score += 3

                    result.reasons.append(
                        "Bearish Histogram"
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

        # ----------------------------------------
        # Neutral
        # ----------------------------------------

        else:

            result.reasons.append(
                "MACD Neutral"
            )

        return result