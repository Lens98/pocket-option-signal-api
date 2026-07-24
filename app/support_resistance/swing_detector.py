class SwingDetector:

    def find_swings(self, candles, lookback=2):

        swing_highs = []
        swing_lows = []

        for i in range(lookback, len(candles) - lookback):

            current = candles[i]

            # Swing High
            if all(
                current.high > candles[j].high
                for j in range(i - lookback, i + lookback + 1)
                if j != i
            ):
                swing_highs.append(current.high)

            # Swing Low
            if all(
                current.low < candles[j].low
                for j in range(i - lookback, i + lookback + 1)
                if j != i
            ):
                swing_lows.append(current.low)

        return swing_highs, swing_lows