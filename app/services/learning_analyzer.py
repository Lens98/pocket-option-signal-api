from app.storage.shared import trade_storage


class LearningAnalyzer:

    # ----------------------------------------
    # Pattern Statistics
    # ----------------------------------------

    def pattern(self, pattern: str):

        trades = trade_storage.all()

        matching = [
            t for t in trades
            if t.pattern == pattern
        ]

        total = len(matching)

        wins = len([
            t for t in matching
            if t.result == "WIN"
        ])

        losses = len([
            t for t in matching
            if t.result == "LOSS"
        ])

        win_rate = (
            round((wins / total) * 100, 2)
            if total > 0
            else 0
        )

        return {
            "trades": total,
            "wins": wins,
            "losses": losses,
            "win_rate": win_rate
        }

    # ----------------------------------------
    # Asset Statistics
    # ----------------------------------------

    def asset(self, asset: str):

        trades = trade_storage.all()

        matching = [
            t for t in trades
            if t.asset == asset
        ]

        total = len(matching)

        wins = len([
            t for t in matching
            if t.result == "WIN"
        ])

        losses = len([
            t for t in matching
            if t.result == "LOSS"
        ])

        win_rate = (
            round((wins / total) * 100, 2)
            if total > 0
            else 0
        )

        return {
            "trades": total,
            "wins": wins,
            "losses": losses,
            "win_rate": win_rate
        }