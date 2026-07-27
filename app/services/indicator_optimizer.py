from app.storage.learning_storage import LearningStorage


class IndicatorOptimizer:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Analyze Indicator
    # ========================================

    def analyze(self):

        stats = self.learning.overall_stats()

        if not stats:

            return None

        total = stats["total"] or 0
        wins = stats["wins"] or 0

        if total == 0:

            return None

        win_rate = round(

            (wins / total) * 100,

            2

        )

        indicators = {

            "EMA": 15,
            "RSI": 15,
            "MACD": 20,
            "ADX": 20,
            "ATR": 10

        }

        report = {}

        for indicator, weight in indicators.items():

            recommendation = "KEEP"

            new_weight = weight

            if win_rate >= 70:

                recommendation = "INCREASE"

                new_weight += 2

            elif win_rate <= 50:

                recommendation = "DECREASE"

                new_weight -= 2

            report[indicator] = {

                "current": weight,

                "recommended": new_weight,

                "recommendation": recommendation

            }

        return {

            "win_rate": win_rate,

            "report": report

        }