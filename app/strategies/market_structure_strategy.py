from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class MarketStructureStrategy:

    def analyze(self, data):

        result = StrategyResult()

        structure = data.get("structure", "UNKNOWN")
        bos = data.get("bos", "NONE")
        choch = data.get("choch", "NONE")

        # ---------------------------------
        # Market Structure
        # ---------------------------------

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

        else:

            result.reasons.append(
                "Neutral Market Structure"
            )

        # ---------------------------------
        # Break Of Structure
        # ---------------------------------

        if bos == "BULLISH_BOS":

            result.bullish_score += Weights.BOS

            result.reasons.append(
                "Bullish Break of Structure"
            )

            result.bullish_score += 3

        elif bos == "BEARISH_BOS":

            result.bearish_score += Weights.BOS

            result.reasons.append(
                "Bearish Break of Structure"
            )

            result.bearish_score += 3

        # ---------------------------------
        # Change Of Character
        # ---------------------------------

        if choch == "BULLISH_CHOCH":

            result.bullish_score += Weights.CHOCH

            result.reasons.append(
                "Bullish Change of Character"
            )

            result.bullish_score += 2

        elif choch == "BEARISH_CHOCH":

            result.bearish_score += Weights.CHOCH

            result.reasons.append(
                "Bearish Change of Character"
            )

            result.bearish_score += 2

        # ---------------------------------
        # Bonus Confirmation
        # ---------------------------------

        if (
            structure == "HH_HL"
            and bos == "BULLISH_BOS"
            and choch == "BULLISH_CHOCH"
        ):

            result.bullish_score += 5

            result.reasons.append(
                "Full Bullish Structure Confirmation"
            )

        elif (
            structure == "LH_LL"
            and bos == "BEARISH_BOS"
            and choch == "BEARISH_CHOCH"
        ):

            result.bearish_score += 5

            result.reasons.append(
                "Full Bearish Structure Confirmation"
            )

        return result