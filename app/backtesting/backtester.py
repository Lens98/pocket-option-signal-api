from app.backtesting.trade import Trade
from app.backtesting.statistics import Statistics

from app.models.market import MarketData


class Backtester:

    def run(self, candles, engine):

        trades = []

        # Start after enough candles for EMA200
        for i in range(200, len(candles) - 1):

            market = MarketData(
                asset="EUR/USD",
                timeframe="1m",
                candles=candles[:i + 1]
            )

            signal = engine.generate_signal(market)

            if signal.action == "WAIT":
                continue

            entry = candles[i].close
            exit_price = candles[i + 1].close

            if signal.action == "CALL":
                win = exit_price > entry
            else:
                win = exit_price < entry

            profit = 1 if win else -1

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

        return Statistics().calculate(trades)