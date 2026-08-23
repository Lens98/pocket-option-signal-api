from app.services.self_optimizer import SelfOptimizer
from app.config.weights import Weights


class WeightOptimizer:

    def __init__(self):

        self.optimizer = SelfOptimizer()

    # ========================================
    # Recommend Indicator Weights
    # ========================================

    def recommend(self):

        report = self.optimizer.analyze()

        if report is None:

            return None

        weights = {

            "EMA": Weights.EMA,
            "RSI": Weights.RSI,
            "MACD": Weights.MACD,
            "ADX": Weights.ADX,
            "ATR": Weights.ATR

        }

        recommendation = report["recommendation"]

        updated = {}

        for name, value in weights.items():

            new_value = value

            if recommendation == "MORE_AGGRESSIVE":

                new_value = min(value + 2, 50)

            elif recommendation == "MORE_CONSERVATIVE":

                new_value = max(value - 2, 5)

            updated[name] = {

                "current": value,
                "recommended": new_value

            }

        return {

            "win_rate": report["win_rate"],
            "recommendation": recommendation,
            "weights": updated

        }