from app.models.candle import Candle
from app.models.market import MarketData
from app.services.indicator_service import IndicatorService
from app.services.trading_engine import TradingEngine

import random

candles = []

price = 100.0

for i in range(5000):

    movement = random.uniform(-0.8, 1.2)

    open_price = price
    close_price = price + movement

    high = max(open_price, close_price) + random.uniform(0.1, 0.5)
    low = min(open_price, close_price) - random.uniform(0.1, 0.5)

    candles.append(
        Candle(
            timestamp=f"2026-07-23 {i}",
            open=open_price,
            high=high,
            low=low,
            close=close_price,
            volume=random.randint(800, 1500)
        )
    )

    price = close_price

market = MarketData(
    asset="EUR/USD",
    timeframe="1m",
    candles=candles
)

# ----------------------------
# Calculate indicators
# ----------------------------

indicator_service = IndicatorService()

indicators = indicator_service.calculate(market)

print("\n===== INDICATORS =====")

print("EMA20:", indicators.ema20)
print("EMA50:", indicators.ema50)
print("EMA200:", indicators.ema200)

print("RSI:", indicators.rsi)

print("MACD:", indicators.macd)
print("Signal:", indicators.signal_line)
print("Histogram:", indicators.histogram)

print("ADX:", indicators.adx)
print("ATR:", indicators.atr)

# ----------------------------
# Run trading engine
# ----------------------------

engine = TradingEngine()

signal = engine.generate_signal(market)

print("\n========== ENGINE RESULT ==========")

print(signal)