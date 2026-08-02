from enum import Enum

from app.models.signal import Signal


class EntryState(Enum):
    WAITING = "WAITING"
    ANALYZING = "ANALYZING"
    READY = "READY"
    WAITING_FOR_CANDLE_CLOSE = "WAITING_FOR_CANDLE_CLOSE"
    ENTRY = "ENTRY"
    ACTIVE = "ACTIVE"
    RESULT = "RESULT"


class EntryManager:

    def determine(self, signal: Signal) -> EntryState:

        print()
        print("========================================")
        print("ENTRY MANAGER")
        print("========================================")
        print("Bias        :", signal.bias)
        print("Confidence  :", signal.confidence)
        print("Probability :", signal.probability)
        print("Risk        :", signal.risk)
        print("Grade       :", signal.grade)
        print("Trend       :", signal.trend)
        print("========================================")

        # ----------------------------------------
        # No valid market direction
        # ----------------------------------------

        if signal.bias not in ["CALL", "PUT"]:

            print("❌ No market bias")
            return EntryState.WAITING

        # ----------------------------------------
        # High Risk
        # ----------------------------------------

        if signal.risk == "HIGH":

            print("❌ High Risk")
            return EntryState.WAITING

        # ----------------------------------------
        # Low Confidence
        # ----------------------------------------

        if signal.confidence < 70:

            print("🟡 Confidence too low")
            return EntryState.ANALYZING

        # ----------------------------------------
        # Low Probability
        # ----------------------------------------

        if signal.probability < 60:

            print("🟡 Probability too low")
            return EntryState.ANALYZING

        # ----------------------------------------
        # Waiting for Pullback
        # ----------------------------------------

        if not signal.pullback_confirmed:

            print("🟡 Waiting for Pullback")
            return EntryState.READY

        # ----------------------------------------
        # Enough confirmations
        # Wait for candle close
        # ----------------------------------------

        print("✅ Waiting for Candle Close")

        return EntryState.WAITING_FOR_CANDLE_CLOSE