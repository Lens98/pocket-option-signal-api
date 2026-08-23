from app.backtesting.trade import Trade
from app.backtesting.statistics import Statistics

from app.cache.cache_builder import CacheBuilder

from app.models.market import MarketData
from app.models.indicator import IndicatorResult

from app.simulator.account import Account
from app.simulator.payout import Payout
from app.simulator.simulator import PocketOptionSimulator


class Backtester:

    MAX_CANDLES = 5000

    def run(self, candles, engine):

        trades = []

        account = Account()
        payout = Payout()
        simulator = PocketOptionSimulator()

        closes = [c.close for c in candles]

        cache = CacheBuilder().build(closes)

        end = min(len(candles) - 1, self.MAX_CANDLES)

        START = 3000

        for i in range(START, end):

            market = MarketData(
                asset="EUR/USD",
                timeframe="1m",
                candles=candles[: i + 1]
            )

            indicator_result = IndicatorResult(
                ema20=cache.ema20[i],
                ema50=cache.ema50[i],
                ema200=cache.ema200[i],
                rsi=cache.rsi[i],
                macd=cache.macd[i],
                signal_line=cache.signal[i],
                histogram=cache.histogram[i]
            )

            signal = engine.generate_signal(
                market,
                indicator_result
            )

            if signal.action == "WAIT":
                continue

            entry = candles[i].close
            exit_price = candles[i + 1].close

            if signal.action == "CALL":
                win = exit_price > entry
            else:
                win = exit_price < entry

            position = simulator.execute(
                account,
                signal,
                win,
                payout
            )

            profit = (
                position.amount * payout.percentage
                if win
                else -position.amount
            )

            trades.append(
                Trade(
                    asset=signal.asset,
                    action=signal.action,
                    entry=entry,
                    exit=exit_price,
                    win=win,
                    profit=profit
                )
            )

        print()
        print("========== ACCOUNT ==========")
        print("Starting Balance:", account.initial_balance)
        print("Ending Balance:", round(account.balance, 2))
        print("Wins:", account.wins)
        print("Losses:", account.losses)
        print("Trades:", account.total_trades)

        return Statistics().calculate(trades)