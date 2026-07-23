from app.models.market import MarketData
from app.models.indicator import IndicatorResult

from app.indicators.ema import calculate_ema
from app.indicators.rsi import calculate_rsi
from app.indicators.macd import calculate_macd


class IndicatorService:

    def calculate(self, market: MarketData):

        closes = [c.close for c in market.candles]

        # Calculate MACD once
        macd = calculate_macd(closes)

        return IndicatorResult(

            ema20=calculate_ema(closes, 20),

            ema50=calculate_ema(closes, 50),

            ema200=calculate_ema(closes, 200),

            rsi=calculate_rsi(closes),

            macd=macd["macd"],

            signal_line=macd["signal"],

            histogram=macd["histogram"]

        )