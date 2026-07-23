from app.models.candle import Candle
from app.models.market import MarketData

from app.services.indicator_service import IndicatorService
from app.services.strategy_service import StrategyService

# Create sample candles
candles = []

price = 100.0

for i in range(250):
    candles.append(
        Candle(
            timestamp=f"2026-07-23 {i}",
            open=price,
            high=price + 1,
            low=price - 1,
            close=price + 0.5,
            volume=1000
        )
    )

    price += 0.3

market = MarketData(
    asset="EUR/USD",
    timeframe="1m",
    candles=candles
)

indicator_service = IndicatorService()
strategy_service = StrategyService()

indicators = indicator_service.calculate(market)

signal = strategy_service.analyze(
    market=market,
    indicators=indicators
)

print("\n========== ENGINE RESULT ==========")
print(signal)