from app.market_data.provider import MarketProvider
from app.models.market import MarketData
from app.timeframe.builder import TimeframeBuilder
from app.timeframe.trend import TrendAnalyzer


market = MarketProvider().historical(
    "app/market_data/sample_data/EURUSD_M1.csv"
)

frames = TimeframeBuilder().build(market.candles)

trend = TrendAnalyzer()

for timeframe in ["1m", "5m", "15m"]:

    market_data = MarketData(
        asset="EUR/USD",
        timeframe=timeframe,
        candles=frames[timeframe]
    )

    print(
        timeframe,
        "->",
        trend.analyze(market_data)
    )