from app.services.ai_learning_engine import AILearningEngine


class IndicatorOptimizer:

    def __init__(self):

         self.ai = AILearningEngine()

    # ========================================
    # Print Report
    # ========================================

    def print_report(self):

        report = self.analyze()

        print()
        print("========================================")
        print("INDICATOR OPTIMIZER")
        print("========================================")

        for name, stats in report.items():

            print(
                f"{name:5} | "
                f"Trades: {stats['trades']:4} | "
                f"Wins: {stats['wins']:4} | "
                f"Losses: {stats['losses']:4} | "
                f"Win%: {stats['win_rate']:6} | "
                f"{stats['recommendation']}"
            )

        print("========================================")   

    # ========================================
    # Analyze Indicator
    # ========================================

    def analyze(self):

        indicators = self.ai.indicator_report()

        report = {}

        for name, stats in indicators.items():

            report[name] = {

                "trades": stats["total"],

                "wins": stats["wins"],

                "losses": stats["losses"],

                "win_rate": stats["win_rate"],

                "recommendation": stats["recommendation"]

            }

        return report