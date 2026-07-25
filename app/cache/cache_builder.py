from app.cache.indicator_cache import IndicatorCache

from app.cache.ema_cache import EmaCache
from app.cache.rsi_cache import RsiCache
from app.cache.macd_cache import MacdCache


class CacheBuilder:

    def build(self, closes):

        cache = IndicatorCache()

        ema20, ema50, ema200 = EmaCache().build(closes)

        cache.ema20 = ema20
        cache.ema50 = ema50
        cache.ema200 = ema200

        cache.rsi = RsiCache().build(closes)

        macd, signal, histogram = MacdCache().build(closes)

        cache.macd = macd
        cache.signal = signal
        cache.histogram = histogram

        return cache