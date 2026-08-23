def calculate_adx(highs, lows, closes, period=14):

    if len(closes) < period * 2:
        return 0.0

    tr = []
    plus_dm = []
    minus_dm = []

    for i in range(1, len(closes)):

        high_diff = highs[i] - highs[i - 1]
        low_diff = lows[i - 1] - lows[i]

        plus = high_diff if high_diff > low_diff and high_diff > 0 else 0
        minus = low_diff if low_diff > high_diff and low_diff > 0 else 0

        plus_dm.append(plus)
        minus_dm.append(minus)

        true_range = max(
            highs[i] - lows[i],
            abs(highs[i] - closes[i - 1]),
            abs(lows[i] - closes[i - 1])
        )

        tr.append(true_range)

    if len(tr) < period:
        return 0.0

    atr = sum(tr[:period]) / period

    plus_dm_avg = sum(plus_dm[:period]) / period
    minus_dm_avg = sum(minus_dm[:period]) / period

    dx_values = []

    for i in range(period, len(tr)):

        atr = ((atr * (period - 1)) + tr[i]) / period

        plus_dm_avg = (
            (plus_dm_avg * (period - 1))
            + plus_dm[i]
        ) / period

        minus_dm_avg = (
            (minus_dm_avg * (period - 1))
            + minus_dm[i]
        ) / period

        if atr == 0:
            continue

        plus_di = 100 * (plus_dm_avg / atr)
        minus_di = 100 * (minus_dm_avg / atr)

        total = plus_di + minus_di

        if total == 0:
            continue

        dx = 100 * abs(plus_di - minus_di) / total

        dx_values.append(dx)

    if not dx_values:
        return 0.0

    adx = sum(dx_values) / len(dx_values)

    return round(adx, 2)