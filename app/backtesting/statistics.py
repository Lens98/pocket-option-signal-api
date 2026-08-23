from app.backtesting.result import BacktestResult


class Statistics:

    def calculate(self, trades):

        wins = sum(1 for t in trades if t.win)

        losses = len(trades) - wins

        total_profit = sum(t.profit for t in trades)

        win_rate = 0

        if trades:

            win_rate = wins / len(trades) * 100

        return BacktestResult(

            trades=trades,

            wins=wins,

            losses=losses,

            win_rate=round(win_rate, 2),

            total_profit=round(total_profit, 2)

        )