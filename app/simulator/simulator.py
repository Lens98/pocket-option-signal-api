from app.simulator.position import Position


class PocketOptionSimulator:

    def execute(
        self,
        account,
        signal,
        win,
        payout
    ):

        amount = account.balance * account.risk_percent

        if win:

            profit = amount * payout.percentage

            account.balance += profit

            account.wins += 1

        else:

            account.balance -= amount

            account.losses += 1

        account.total_trades += 1

        return Position(

            action=signal.action,

            amount=amount,

            payout=payout.percentage,

            win=win

        )