from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights

class MacdStrategy:

    def analyze(self, indicators):

        result = StrategyResult()

        if indicators.macd > indicators.signal_line:

            result.bullish_score = Weights.MACD
            result.reasons.append("MACD Bullish Cross")

        elif indicators.macd < indicators.signal_line:

            result.bearish_score = Weights.MACD
            result.reasons.append("MACD Bearish Cross")

        return result