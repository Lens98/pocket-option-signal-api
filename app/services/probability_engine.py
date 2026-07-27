from app.storage.learning_storage import LearningStorage


class ProbabilityEngine:

    def __init__(self):

        self.learning = LearningStorage()

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

        if asset and asset["total"] and asset["total"] >= 10:

            asset_rate = (

                asset["wins"] /
                asset["total"]

            ) * 100

            print("Asset Win Rate :", round(asset_rate, 2))

            probability = (

                probability * 0.75 +

                asset_rate * 0.25

            )

        # ========================================
        # Market Regime
        # ========================================

        regime = self.learning.regime_stats(

            signal.regime

        )

        if regime and regime["total"] and regime["total"] >= 10:

            regime_rate = (

                regime["wins"] /
                regime["total"]

            ) * 100

            print("Regime Win Rate :", round(regime_rate, 2))

            probability = (

                probability * 0.85 +

                regime_rate * 0.15

            )

        # ========================================
        # Indicator Mode
        # ========================================

        mode = self.learning.mode_stats(

            indicator_mode

        )

        if mode and mode["total"] and mode["total"] >= 10:

            mode_rate = (

                mode["wins"] /
                mode["total"]

            ) * 100

            print("Mode Win Rate :", round(mode_rate, 2))

            probability = (

                probability * 0.90 +

                mode_rate * 0.10

            )

        # ========================================
        # Overall AI Performance
        # ========================================

        overall = self.learning.overall_stats()

        if overall and overall["total"] and overall["total"] >= 50:

            overall_rate = (

                overall["wins"] /
                overall["total"]

            ) * 100

            print("Overall Win Rate :", round(overall_rate, 2))

            probability = (

                probability * 0.90 +

                overall_rate * 0.10

            )

        # ========================================
        # Recent Performance
        # ========================================

        recent = self.learning.recent_stats(50)

        if recent and recent["total"] and recent["total"] >= 20:

            recent_rate = (

                recent["wins"] /
                recent["total"]

            ) * 100

            print("Recent Win Rate :", round(recent_rate, 2))

            probability = (

                probability * 0.80 +

                recent_rate * 0.20

            )

        # ========================================
        # Clamp Probability
        # ========================================

        probability = max(

            0,

            min(

                probability,

                100

            )

        )

        probability = round(

            probability,

            2

        )

        print("----------------------------------------")
        print("Final Probability :", probability)
        print("----------------------------------------")

        return probability