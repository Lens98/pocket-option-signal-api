from app.models.market import MarketData
from app.models.indicator import IndicatorResult


class PullbackDetector:

    def confirm(
        self,
        market: MarketData,
        indicators: IndicatorResult,
        bias: str
    ) -> bool:

        candles = market.candles

        if len(candles) < 3:
            return False

        last = candles[-1]

        # ----------------------------------------
        # Bullish Pullback
        # ----------------------------------------

        if bias == "CALL":

            if indicators.ema20 is None:
                return False

            return (
                last.low <= indicators.ema20
                and last.close > indicators.ema20
            )

        # ----------------------------------------
        # Bearish Pullback
        # ----------------------------------------

        if bias == "PUT":

            if indicators.ema20 is None:
                return False

            return (
                last.high >= indicators.ema20
                and last.close < indicators.ema20
            )

        return False