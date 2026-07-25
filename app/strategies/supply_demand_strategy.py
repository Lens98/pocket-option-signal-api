from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights

class SupplyDemandStrategy:

    def analyze(self, zone):

        result = StrategyResult()

        if zone == "DEMAND":

            result.bullish_score += Weights.SUPPLY_DEMAND

            result.reasons.append(
                "Demand Zone"
            )

        elif zone == "SUPPLY":

            result.bearish_score += Weights.SUPPLY_DEMAND

            result.reasons.append(
                "Supply Zone"
            )

        return result