from app.storage.learning_storage import LearningStorage
from app.services.session_ranking import SessionRanking
from app.services.asset_ranking import AssetRanking
from app.services.asset_learning import AssetLearning

class ProbabilityEngine:

    def __init__(self):

        self.learning = LearningStorage()
        self.sessions = SessionRanking()
        self.assets = AssetRanking()
        self.asset_learning = AssetLearning()
    # ========================================
    # Safe Win Rate
    # ========================================

    def _win_rate(self, row):

        if not row:
            return None

        total = row["total"] or 0
        wins = row["wins"] or 0

        if total == 0:
            return None

        return (wins / total) * 100

    # ========================================
    # Calculate Win Probability
    # ========================================

    def calculate(self, signal, indicator_mode):

        probability = signal.confidence

        print("----------------------------------------")
        print("Probability Engine")
        print("----------------------------------------")
        print("Starting Confidence :", probability)

        # ========================================
        # Asset History
        # ========================================

        asset = self.learning.asset_stats(signal.asset)

        if asset and (asset["total"] or 0) >= 10:

            asset_rate = self._win_rate(asset)

            if asset_rate is not None:

                print("Asset Win Rate :", round(asset_rate, 2))

                probability = probability * 0.75 + asset_rate * 0.25

        # ========================================
        # Regime History
        # ========================================

        regime = self.learning.regime_stats(signal.regime)

        if regime and (regime["total"] or 0) >= 10:

            regime_rate = self._win_rate(regime)

            if regime_rate is not None:

                print("Regime Win Rate :", round(regime_rate, 2))

                probability = probability * 0.85 + regime_rate * 0.15

        # ========================================
        # Session Statistics
        # ========================================

        session = self.learning.session_stats(signal.session)

        if session and (session["total"] or 0) >= 10:

            session_rate = self._win_rate(session)

            if session_rate is not None:

                print("Session Win Rate :", round(session_rate, 2))

                probability = probability * 0.90 + session_rate * 0.10

        # ========================================
        # Indicator Mode
        # ========================================

        mode = self.learning.mode_stats(indicator_mode)

        if mode and (mode["total"] or 0) >= 10:

            mode_rate = self._win_rate(mode)

            if mode_rate is not None:

                print("Mode Win Rate :", round(mode_rate, 2))

                probability = probability * 0.90 + mode_rate * 0.10

        # ========================================
        # Overall Performance
        # ========================================

        overall = self.learning.overall_stats()

        if overall and (overall["total"] or 0) >= 50:

            overall_rate = self._win_rate(overall)

            if overall_rate is not None:

                print("Overall Win Rate :", round(overall_rate, 2))

                probability = probability * 0.90 + overall_rate * 0.10

        # ========================================
        # Recent Performance
        # ========================================

        recent = self.learning.recent_stats(50)

        if recent and (recent["total"] or 0) >= 20:

            recent_rate = self._win_rate(recent)

            if recent_rate is not None:

                print("Recent Win Rate :", round(recent_rate, 2))

                probability = probability * 0.80 + recent_rate * 0.20

        # ========================================
        # Session Ranking
        # ========================================

        session_rankings = self.sessions.rank()

        current_session = None

        for item in session_rankings:

            if item["session"] == signal.session:

                current_session = item

                break

        if current_session:

            trades = current_session["trades"]
            rate = current_session["win_rate"]

            if trades >= 20:

                print("----------------------------------------")
                print("Session Ranking")
                print("----------------------------------------")
                print("Session :", current_session["session"])
                print("Trades  :", trades)
                print("Win Rate:", rate)

                if rate >= 70:

                    probability += 5

                    print("Bonus : +5")

                elif rate >= 60:

                    probability += 3

                    print("Bonus : +3")

                elif rate <= 45:

                    probability -= 5

                    print("Penalty : -5")

                elif rate <= 50:

                    probability -= 2

                    print("Penalty : -2")
                
        # ========================================
        # Asset Learning
        # ========================================

        learning = self.asset_learning.evaluate(

            signal,

            indicator_mode

        )

        if learning:

            print("----------------------------------------")
            print("Asset Learning")
            print("----------------------------------------")
            print("Asset   :", learning.get("asset"))
            print("Session :", learning.get("session"))
            print("Regime  :", learning.get("regime"))
            print("Mode    :", learning.get("mode"))
            print(
    "Win Rate:",
    learning.get("win_rate", 0)
)

            rate = learning.get("win_rate", 0)

            if rate >= 80:

                probability += 4

                print("Learning Bonus : +4")

            elif rate <= 45:

                probability -= 4

                print("Learning Penalty : -4")
        # ========================================
        # Asset Ranking
        # ========================================

        asset_rankings = self.assets.rank()

        current_asset = None

        for item in asset_rankings:

            if item["asset"] == signal.asset:

                current_asset = item

                break

        if current_asset:

            trades = current_asset["trades"]
            rate = current_asset["win_rate"]

            if trades >= 20:

                print("----------------------------------------")
                print("Asset Ranking")
                print("----------------------------------------")
                print("Asset    :", current_asset["asset"])
                print("Trades   :", trades)
                print("Win Rate :", rate)

                if rate >= 75:

                    probability += 5

                    print("Asset Bonus : +5")

                elif rate >= 65:

                    probability += 3

                    print("Asset Bonus : +3")

                elif rate <= 45:

                    probability -= 5

                    print("Asset Penalty : -5")

                elif rate <= 50:

                    probability -= 2

                    print("Asset Penalty : -2")

        # ========================================
        # Clamp
        # ========================================

        probability = max(0, min(probability, 100))

        probability = round(probability, 2)

        print("----------------------------------------")
        print("Final Probability :", probability)
        print("----------------------------------------")

        return probability