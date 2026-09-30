from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class MarketStructureStrategy:

    def analyze(self, data):

        result = StrategyResult()

        structure = data.get("structure", "UNKNOWN")
        bos = data.get("bos", "NONE")
        choch = data.get("choch", "NONE")

        # ========================================
        # Trend Structure
        # ========================================

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
                "Sideways Market Structure"
            )

        # ========================================
        # Break Of Structure
        # ========================================

        if bos == "BULLISH_BOS":

            result.bullish_score += Weights.BOS + 3

            result.reasons.append(
                "Bullish Break of Structure"
            )

        elif bos == "BEARISH_BOS":

            result.bearish_score += Weights.BOS + 3

            result.reasons.append(
                "Bearish Break of Structure"
            )

        # ========================================
        # Change Of Character
        # ========================================

        if choch == "BULLISH_CHOCH":

            result.bullish_score += Weights.CHOCH + 2

            result.reasons.append(
                "Bullish Change of Character"
            )

        elif choch == "BEARISH_CHOCH":

            result.bearish_score += Weights.CHOCH + 2

            result.reasons.append(
                "Bearish Change of Character"
            )

        # ========================================
        # Strong Confirmation
        # ========================================

        bullish_confirmed = (

            structure == "HH_HL"

            and bos == "BULLISH_BOS"

            and choch == "BULLISH_CHOCH"

        )

        bearish_confirmed = (

            structure == "LH_LL"

            and bos == "BEARISH_BOS"

            and choch == "BEARISH_CHOCH"

        )

        if bullish_confirmed:

            result.bullish_score += 10

            result.reasons.append(
                "Strong Bullish Market Structure"
            )

        elif bearish_confirmed:

            result.bearish_score += 10

            result.reasons.append(
                "Strong Bearish Market Structure"
            )

        # ========================================
        # Score Limit
        # ========================================

        result.bullish_score = min(
            result.bullish_score,
            30
        )

        result.bearish_score = min(
            result.bearish_score,
            30
        )

        return result