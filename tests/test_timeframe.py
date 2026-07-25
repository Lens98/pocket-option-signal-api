from app.timeframe.aggregator import TimeframeAggregator
from app.market_data.provider import MarketProvider

market = MarketProvider().historical(
    "app/market_data/sample_data/EURUSD_M1.csv"
)

agg = TimeframeAggregator()

m5 = agg.aggregate(market.candles, 5)

m15 = agg.aggregate(market.candles, 15)

print()

print("1 Minute:", len(market.candles))

print("5 Minute:", len(m5))

print("15 Minute:", len(m15))