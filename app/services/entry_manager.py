from enum import Enum

from app.models.signal import Signal
from app.services.decision_explainer import DecisionExplainer
from app.services.decision_history import DecisionHistory
from app.services.pattern_learning import PatternLearning
MIN_CONFIDENCE = 70

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
        self.pattern_learning = PatternLearning()

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

        if signal.confidence < MIN_CONFIDENCE:

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
            print("Bias        :", signal.bias)
            print("Risk        :", signal.risk)
            print("Confidence  :", signal.confidence)
            print("Probability :", signal.probability)
            print("Agreement   :", signal.agreement_score)
            print(
                "Confirmations:",
                f"{signal.confirmation_count}/"
                f"{signal.confirmation_total}"
            )
            print("Pullback    :", signal.pullback_confirmed)
            print("========================================")

            print("🟡 Waiting for Pullback")

            return EntryState.READY

        # ----------------------------------------
        # Pattern Learning Check
        # ----------------------------------------

        print("========================================")
        print("🧠 PATTERN LEARNING CHECK")
        print("========================================")

        pattern_stats = self.pattern_learning.statistics(signal)

        pattern = pattern_stats["pattern"]
        wins = pattern_stats["wins"]
        losses = pattern_stats["losses"]
        total = pattern_stats["total"]
        win_rate = pattern_stats["win_rate"]

        print("Pattern   :", pattern)
        print("Wins      :", wins)
        print("Losses    :", losses)
        print("Total     :", total)
        print("Win Rate  :", round(win_rate, 2), "%")
        print("========================================")

        # ----------------------------------------
        # Insufficient Pattern History
        # ----------------------------------------

        if total < 10:

            print("🟡 Pattern history insufficient")
            print("Using normal strategy.")

        # ----------------------------------------
        # Good Historical Pattern
        # ----------------------------------------

        elif win_rate >= 60:

            print("🟢 GOOD PATTERN")
            print(
                f"Historical win rate: {win_rate:.2f}%"
            )

        # ----------------------------------------
        # Bad Historical Pattern
        # ----------------------------------------

        elif win_rate < 45:

            print("🔴 BAD PATTERN")
            print(
                f"Historical win rate: {win_rate:.2f}%"
            )

            print("❌ Trade blocked by pattern learning")

            return EntryState.CONFIRMING

        # ----------------------------------------
        # Neutral Historical Pattern
        # ----------------------------------------

        else:

            print("🟡 NEUTRAL PATTERN")
            print(
                f"Historical win rate: {win_rate:.2f}%"
            )

        # ----------------------------------------
        # Enough Confirmations
        # Wait for Candle Close
        # ----------------------------------------

        print("========================================")
        print("✅ WAITING FOR CANDLE CLOSE")
        print("========================================")
        print("Bias       :", signal.bias)
        print("Pattern    :", pattern)
        print("Win Rate   :", round(win_rate, 2), "%")
        print("========================================")

        return EntryState.WAITING_FOR_CANDLE_CLOSE