from app.storage.learning_storage import LearningStorage


class IndicatorStatistics:

    def __init__(self):

        self.learning = LearningStorage()

    # ========================================
    # Safe Win Rate
    # ========================================

    def _rate(self, row):

        if not row:

            return 0.0

        total = row["total"] or 0
        wins = row["wins"] or 0

        if total == 0:

            return 0.0

        return round((wins / total) * 100, 2)

    # ========================================
    # EMA
    # ========================================

    def ema(self):

        row = self.learning.ema_stats()

        return {

            "indicator": "EMA",

            "trades": row["total"] if row else 0,

            "wins": row["wins"] if row else 0,

            "win_rate": self._rate(row)

        }

    # ========================================
    # RSI
    # ========================================

    def rsi(self):

        row = self.learning.rsi_stats()

        return {

            "indicator": "RSI",

            "trades": row["total"] if row else 0,

            "wins": row["wins"] if row else 0,

            "win_rate": self._rate(row)

        }

    # ========================================
    # MACD
    # ========================================

    def macd(self):

        row = self.learning.macd_stats()

        return {

            "indicator": "MACD",

            "trades": row["total"] if row else 0,

            "wins": row["wins"] if row else 0,

            "win_rate": self._rate(row)

        }

    # ========================================
    # ADX
    # ========================================

    def adx(self):

        row = self.learning.adx_stats()

        return {

            "indicator": "ADX",

            "trades": row["total"] if row else 0,

            "wins": row["wins"] if row else 0,

            "win_rate": self._rate(row)

        }

    # ========================================
    # ATR
    # ========================================

    def atr(self):

        row = self.learning.atr_stats()

        return {

            "indicator": "ATR",

            "trades": row["total"] if row else 0,

            "wins": row["wins"] if row else 0,

            "win_rate": self._rate(row)

        }

    # ========================================
    # Full Report
    # ========================================

    def report(self):

        return [

            self.ema(),

            self.rsi(),

            self.macd(),

            self.adx(),

            self.atr()

        ]

    # ========================================
    # Console Report
    # ========================================

    def print_report(self):

        print()
        print("========================================")
        print("INDICATOR PERFORMANCE")
        print("========================================")

        for item in self.report():

            print(

                f'{item["indicator"]:5} | '
                f'Trades: {item["trades"]:4} | '
                f'Wins: {item["wins"]:4} | '
                f'Win Rate: {item["win_rate"]:.2f}%'

            )

        print("========================================")
        print()