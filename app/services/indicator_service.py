from app.models.market import MarketData
from app.models.indicator import IndicatorResult

from app.indicators.ema import calculate_ema
from app.indicators.rsi import calculate_rsi
from app.indicators.macd import calculate_macd

from app.config.settings import settings


class IndicatorService:

    def calculate(self, market: MarketData):

        closes = [c.close for c in market.candles]

        # Calculate MACD once
        macd = calculate_macd(closes)

        return IndicatorResult(

            ema20=calculate_ema(
                closes,
                settings.EMA_FAST
            ),

            ema50=calculate_ema(
                closes,
                settings.EMA_MIDDLE
            ),

            ema200=calculate_ema(
                closes,
                settings.EMA_SLOW
            ),

            rsi=calculate_rsi(
                closes,
                settings.RSI_PERIOD
            ),

            macd=macd["macd"],

            signal_line=macd["signal"],

            histogram=macd["histogram"]

        )