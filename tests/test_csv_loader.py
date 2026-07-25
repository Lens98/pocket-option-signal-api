from app.market_data.provider import MarketProvider

market = MarketProvider().historical(
    "app/market_data/sample_data/EURUSD_M1.csv"
)

print()

print("========== MARKET LOADED ==========")

print("Asset:", market.asset)

print("Timeframe:", market.timeframe)

print("Candles:", len(market.candles))

print()

print("First Candle:")

print(market.candles[0])

print()

print("Last Candle:")

print(market.candles[-1])