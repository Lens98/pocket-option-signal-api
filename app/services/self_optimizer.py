from app.storage.learning_storage import LearningStorage


class SelfOptimizer:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Analyze Performance
    # ========================================

    def analyze(self):

        overall = self.learning.overall_stats()

        if not overall:

            return None

        total = overall["total"] or 0
        wins = overall["wins"] or 0

        if total < 20:

            return None

        win_rate = round(

            (wins / total) * 100,

            2

        )

        recommendation = "KEEP"

        if win_rate >= 70:

            recommendation = "MORE_AGGRESSIVE"

        elif win_rate <= 50:

            recommendation = "MORE_CONSERVATIVE"

        return {

            "trades": total,

            "wins": wins,

            "win_rate": win_rate,

            "recommendation": recommendation

        }