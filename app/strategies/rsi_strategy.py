from app.strategies.strategy_result import StrategyResult
from app.config.settings import settings


class RsiStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        if indicators.rsi < settings.RSI_OVERSOLD:

            result.bullish_score = 20
            result.reasons.append("RSI Oversold")

        elif indicators.rsi > settings.RSI_OVERBOUGHT:

            result.bearish_score = 20
            result.reasons.append("RSI Overbought")

        return result