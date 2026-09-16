from collections import deque
from datetime import datetime
from app.database.decision_history_repository import DecisionHistoryRepository

class DecisionHistory:

    def __init__(self, max_history=50):

        self.history = deque(maxlen=max_history)
        self.repository = DecisionHistoryRepository()

    # ========================================
    # Add Decision
    # ========================================

    def add(
        self,
        signal,
        report
    ):

        self.history.append({

            "time": datetime.now().strftime(
                "%H:%M:%S"
            ),

            "asset": signal.asset,

            "bias": signal.bias,

            "decision": report["decision"],

            "blocked_by": report["blocked_by"],

            "confidence": signal.confidence,

            "probability": signal.probability,

            "agreement": signal.agreement_score,

            "confirmations": (
                f"{signal.confirmation_count}/"
                f"{signal.confirmation_total}"
            ),

            "risk": signal.risk,

            "pattern": getattr(
                signal,
                "pattern",
                ""
            )

        })
        self.repository.save(

            self.history[-1]

        )

    # ========================================
    # Last Decisions
    # ========================================

    def recent(self, limit=10):

        return list(self.history)[-limit:]

    # ========================================
    # Count Block Reasons
    # ========================================

    def blocked_statistics(self):

        stats = {}

        for item in self.history:

            reason = item["blocked_by"]

            if reason is None:

                reason = "ENTER"

            stats[reason] = (
                stats.get(reason, 0) + 1
            )

        return dict(

            sorted(

                stats.items(),

                key=lambda x: x[1],

                reverse=True

            )

        )

    # ========================================
    # Print Recent Decisions
    # ========================================

    def print(self, limit=10):

        print()
        print("========================================")
        print("DECISION HISTORY")
        print("========================================")

        for item in self.recent(limit):

            print(
                f"[{item['time']}] "
                f"{item['asset']} | "
                f"{item['decision']} | "
                f"Blocked: {item['blocked_by']} | "
                f"C:{item['confidence']} "
                f"P:{item['probability']}"
            )

        print("========================================")

            # ========================================
    # Database Recent
    # ========================================

    def database_recent(self, limit=50):

        return self.repository.recent(limit)

    # ========================================
    # Database Statistics
    # ========================================

    def blocked_statistics_db(self):

        return self.repository.blocked_statistics()

    # ========================================
    # Approval Rate
    # ========================================

    def approval_rate(self):

        return self.repository.approval_rate()