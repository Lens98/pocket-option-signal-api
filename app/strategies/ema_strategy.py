from app.config.weights import Weights
from app.strategies.strategy_result import StrategyResult


class EmaStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        if indicators.ema20 > indicators.ema50 > indicators.ema200:

            result.trend = "BULLISH"
            result.bullish_score += Weights.EMA
            result.reasons.append(
                "EMA Bullish Alignment"
            )

        elif indicators.ema20 < indicators.ema50 < indicators.ema200:

            result.trend = "BEARISH"
            result.bearish_score += Weights.EMA
            result.reasons.append(
                "EMA Bearish Alignment"
            )

        return result