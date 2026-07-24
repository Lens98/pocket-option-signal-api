from app.services.trading_engine import TradingEngine
from app.backtesting.backtester import Backtester

from app.models.candle import Candle

import random


candles = []

price = 100

for i in range(500):

    movement = random.uniform(-0.8, 1.2)

    open_price = price
    close_price = price + movement

    high = max(open_price, close_price) + 0.5
    low = min(open_price, close_price) - 0.5

    candles.append(
        Candle(
            timestamp=str(i),
            open=open_price,
            high=high,
            low=low,
            close=close_price,
            volume=1000
        )
    )

    price = close_price


engine = TradingEngine()

backtester = Backtester()

result = backtester.run(candles, engine)

print("\n========== BACKTEST RESULT ==========")

print("Trades:", len(result.trades))
print("Wins:", result.wins)
print("Losses:", result.losses)
print("Win Rate:", result.win_rate, "%")
print("Profit:", result.total_profit)