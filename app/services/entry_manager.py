from enum import Enum

from app.models.signal import Signal
from app.services.decision_explainer import DecisionExplainer
from app.services.decision_history import DecisionHistory

class EntryState(Enum):

    WAITING = "WAITING"
    ANALYZING = "ANALYZING"
    CONFIRMING = "CONFIRMING"
    READY = "READY"
    WAITING_FOR_CANDLE_CLOSE = "WAITING_FOR_CANDLE_CLOSE"
    ENTRY = "ENTRY"
    ACTIVE = "ACTIVE"
    RESULT = "RESULT"


class EntryManager:

    def __init__(self):

        self.explainer = DecisionExplainer()
        self.history = DecisionHistory()

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
        # AI Decision Explanation
        # ----------------------------------------

        report = self.explainer.print(signal)

        self.history.add(
            signal,
            report
        )

        self.history.print(5)

        # Continue with the rest of your code...

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

        if signal.confidence < 60:

            print("🟡 Confidence too low")
            return EntryState.ANALYZING

        # ----------------------------------------
        # Low Probability
        # ----------------------------------------

        if signal.probability < 50:

            print("🟡 Probability too low")
            return EntryState.ANALYZING
        # ----------------------------------------
        # Agreement Score
        # ----------------------------------------

        print("Agreement  :", signal.agreement_score)

        if signal.agreement_score < 70:

            print("🟡 Agreement too weak")

            return EntryState.CONFIRMING
        # ----------------------------------------
        # Confirmation Count
        # ----------------------------------------

        print(
            "Confirmations :",
            signal.confirmation_count,
            "/",
            signal.confirmation_total
         )

        if signal.confirmation_count < 4:

          print("🟡 Not enough confirmations")

          return EntryState.CONFIRMING
    
        # ----------------------------------------
        # Waiting for Pullback
        # ----------------------------------------

        if not signal.pullback_confirmed:
            print("========================================")
            print("ENTRY CHECK")
            print("========================================")
            print("Bias      :", signal.bias)
            print("Risk      :", signal.risk)
            print("Confidence:", signal.confidence)
            print("Probability:", signal.probability)
            print("Agreement :", signal.agreement_score)
            print(
                 "Confirmations:",
                   f"{signal.confirmation_count}/{signal.confirmation_total}"
)
            print("Pullback :", signal.pullback_confirmed)
            print("========================================")

            print("🟡 Waiting for Pullback")
            return EntryState.READY

        # ----------------------------------------
        # Enough confirmations
        # Wait for candle close
        # ----------------------------------------

        print("✅ Waiting for Candle Close")

        return EntryState.WAITING_FOR_CANDLE_CLOSE