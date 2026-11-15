from app.storage.learning_storage import LearningStorage


class AILearningEngine:

    def __init__(self):

        self.learning = LearningStorage()

     # ========================================
    # Print Learning Report
    # ========================================

    def print_report(self):

        report = self.analyze()

        print()
        print("========================================")
        print("AI LEARNING REPORT")
        print("========================================")

        for name, stats in report.items():

            print()

            print(name.upper())

            print("Trades :", stats["total"])

            print("Wins   :", stats["wins"])

            print("Losses :", stats["losses"])

            print("Win %  :", stats["win_rate"])

            print("Action :", stats["recommendation"])

        print("========================================")

    # ========================================
    # Analyze AI Performance
    # ========================================

    def analyze(self):

        report = {

            "overall": self._calculate(
                self.learning.overall_stats()
            ),

            "ema": self._calculate(
                self.learning.ema_stats()
            ),

            "rsi": self._calculate(
                self.learning.rsi_stats()
            ),

            "macd": self._calculate(
                self.learning.macd_stats()
            ),

            "adx": self._calculate(
                self.learning.adx_stats()
            ),

            "atr": self._calculate(
                self.learning.atr_stats()
            )

        }

        return report

        # ========================================
    # Indicator Report
    # ========================================

    def indicator_report(self):

        return {

            "EMA": self._calculate(
                self.learning.ema_stats()
            ),

            "RSI": self._calculate(
                self.learning.rsi_stats()
            ),

            "MACD": self._calculate(
                self.learning.macd_stats()
            ),

            "ADX": self._calculate(
                self.learning.adx_stats()
            ),

            "ATR": self._calculate(
                self.learning.atr_stats()
            )

        }

    # ========================================
    # Calculate Statistics
    # ========================================

    def _calculate(self, stats):

        total = stats["total"] or 0
        wins = stats["wins"] or 0

        losses = total - wins

        if total == 0:

            win_rate = 0

        else:

            win_rate = round(
                (wins / total) * 100,
                2
            )

        if total < 30:

            recommendation = "NOT ENOUGH DATA"

        elif win_rate >= 70:

           recommendation = "INCREASE"

        elif win_rate >= 60:

           recommendation = "KEEP"

        else:

           recommendation = "DECREASE"

        return {

            "total": total,

            "wins": wins,

           "losses": losses,

           "win_rate": win_rate,

           "recommendation": recommendation

        }