from app.market_data.provider import MarketProvider
from app.timeframe.builder import TimeframeBuilder

market = MarketProvider().historical(
    "app/market_data/sample_data/EURUSD_M1.csv"
)

frames = TimeframeBuilder().build(market.candles)

print()

print("1m:", len(frames["1m"]))

print("5m:", len(frames["5m"]))

print("15m:", len(frames["15m"]))