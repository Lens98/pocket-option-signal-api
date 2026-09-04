from app.storage.learning_storage import LearningStorage


class AssetLearning:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Learn Asset Combination
    # ========================================

    def evaluate(self, signal, indicator_mode):

        stats = self.learning.asset_stats(

            signal.asset

        )

        if not stats:

            return None

        total = stats["total"] or 0
        wins = stats["wins"] or 0

        if total < 20:

            return None

        rate = round(

            (wins / total) * 100,

            2

        )

        return {

            "asset": signal.asset,

            "trades": total,

            "wins": wins,

            "win_rate": rate,

            "mode": indicator_mode,

            "session": signal.session,

            "regime": signal.regime

        }