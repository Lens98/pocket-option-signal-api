class SwingDetector:

    def find_swings(self, candles, lookback=2):

        swing_highs = []
        swing_lows = []

        for i in range(lookback, len(candles) - lookback):

            high = candles[i].high
            low = candles[i].low

            is_swing_high = True
            is_swing_low = True

            for j in range(i - lookback, i + lookback + 1):

                if j == i:
                    continue

                if candles[j].high >= high:
                    is_swing_high = False

                if candles[j].low <= low:
                    is_swing_low = False

            if is_swing_high:
                swing_highs.append((i, high))

            if is_swing_low:
                swing_lows.append((i, low))

        return swing_highs, swing_lows