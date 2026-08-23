def calculate_atr(highs, lows, closes, period=14):

    if len(closes) < period + 1:
        return 0.0

    true_ranges = []

    for i in range(1, len(closes)):

        tr = max(
            highs[i] - lows[i],
            abs(highs[i] - closes[i - 1]),
            abs(lows[i] - closes[i - 1])
        )

        true_ranges.append(tr)

    atr = sum(true_ranges[:period]) / period

    for tr in true_ranges[period:]:

        atr = ((atr * (period - 1)) + tr) / period

    return round(atr, 5)