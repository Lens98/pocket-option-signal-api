from app.cache.cache_builder import CacheBuilder

closes = list(range(1, 301))

cache = CacheBuilder().build(closes)

print()

print("========== CACHE ==========")

print("EMA20:", cache.ema20[-1])

print("EMA50:", cache.ema50[-1])

print("EMA200:", cache.ema200[-1])

print("RSI:", cache.rsi[-1])

print("MACD:", cache.macd[-1])

print("Signal:", cache.signal[-1])
