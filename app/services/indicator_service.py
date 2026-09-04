from app.models.market import MarketData
from app.models.indicator import IndicatorResult

from app.indicators.ema import calculate_ema
from app.indicators.rsi import calculate_rsi
from app.indicators.macd import calculate_macd
from app.indicators.adx import calculate_adx
from app.indicators.atr import calculate_atr

from app.config.settings import settings


class IndicatorService:

    def calculate(self, market: MarketData):

        highs = [c.high for c in market.candles]
        lows = [c.low for c in market.candles]
        closes = [c.close for c in market.candles]

        candle_count = len(closes)

        print("----------------------------------------")
        print("Indicator Service")
        print("----------------------------------------")
        print("Candles:", candle_count)

        # ----------------------------------------
        # Need minimum history
        # ----------------------------------------

        if candle_count < 6:

            raise ValueError(
           f"Need at least 6 candles ({candle_count})"
          )

        # ----------------------------------------
        # Calculate indicators that are available
        # ----------------------------------------

        ema20 = None
        ema50 = None
        ema200 = None

        rsi = None

        macd = None
        signal_line = None
        histogram = None

        atr = None
        adx = None

        # RSI

        if candle_count >= settings.RSI_PERIOD:

            rsi = calculate_rsi(
                closes,
                settings.RSI_PERIOD
            )

        # MACD

        if candle_count >= 35:

            macd_result = calculate_macd(closes)

            macd = macd_result["macd"]
            signal_line = macd_result["signal"]
            histogram = macd_result["histogram"]

        # EMA20

        if candle_count >= settings.EMA_FAST:

            ema20 = calculate_ema(
                closes,
                settings.EMA_FAST
            )

        # EMA50

        if candle_count >= settings.EMA_MIDDLE:

            ema50 = calculate_ema(
                closes,
                settings.EMA_MIDDLE
            )

        # ATR / ADX

        if candle_count >= 100:

            atr = calculate_atr(
                highs,
                lows,
                closes
            )

            adx = calculate_adx(
                highs,
                lows,
                closes
            )

        # EMA200

        if candle_count >= settings.EMA_SLOW:

            ema200 = calculate_ema(
                closes,
                settings.EMA_SLOW
            )

        # ----------------------------------------
        # Select Mode
        # ----------------------------------------

        if candle_count >= 200:

            mode = "FULL"

        elif candle_count >= 100:

            mode = "ADVANCED"

        elif candle_count >= 50:

            mode = "STANDARD"

        else:

            mode = "STARTUP"

        print("Mode:", mode)
        print("----------------------------------------")

        return IndicatorResult(

            mode=mode,

            ema20=ema20,
            ema50=ema50,
            ema200=ema200,

            rsi=rsi,

            macd=macd,
            signal_line=signal_line,
            histogram=histogram,

            adx=adx,
            atr=atr

        )