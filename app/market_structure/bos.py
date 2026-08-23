class BreakOfStructure:

    def analyze(
        self,
        candles,
        swing_highs,
        swing_lows
    ):

        if len(swing_highs) < 1 or len(swing_lows) < 1:
            return "NONE"

        last_close = candles[-1].close

        last_high = swing_highs[-1][1]
        last_low = swing_lows[-1][1]

        if last_close > last_high:
            return "BULLISH_BOS"

        if last_close < last_low:
            return "BEARISH_BOS"

        return "NONE"