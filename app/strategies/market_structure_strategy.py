from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights

class MarketStructureStrategy:

    def analyze(self, data):

        result = StrategyResult()

        structure = data["structure"]
        bos = data["bos"]
        choch = data["choch"]

        # ----------------------------
        # Market Structure
        # ----------------------------

        if structure == "HH_HL":

            result.trend = "BULLISH"
            result.bullish_score += Weights.MARKET_STRUCTURE
            result.reasons.append(
                "Higher High + Higher Low"
            )

        elif structure == "LH_LL":

            result.trend = "BEARISH"
            result.bearish_score += Weights.MARKET_STRUCTURE
            result.reasons.append(
                "Lower High + Lower Low"
            )

        # ----------------------------
        # Break of Structure
        # ----------------------------

        if bos == "BULLISH_BOS":

            result.bullish_score += Weights.BOS
            result.reasons.append(
                "Bullish Break of Structure"
            )

        elif bos == "BEARISH_BOS":

            result.bearish_score += Weights.BOS
            result.reasons.append(
                "Bearish Break of Structure"
            )

        # ----------------------------
        # Change of Character
        # ----------------------------

        if choch == "BULLISH_CHOCH":

            result.bullish_score += Weights.CHOCH
            result.reasons.append(
                "Bullish Change of Character"
            )

        elif choch == "BEARISH_CHOCH":

            result.bearish_score += Weights.CHOCH
            result.reasons.append(
                "Bearish Change of Character"
            )

        return result