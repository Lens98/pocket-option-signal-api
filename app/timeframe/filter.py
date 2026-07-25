class MultiTimeframeFilter:

    def allow_trade(
        self,
        trend_5m,
        trend_15m
    ):

        if trend_5m == "BULLISH" and trend_15m == "BULLISH":
            return True

        if trend_5m == "BEARISH" and trend_15m == "BEARISH":
            return True

        return False