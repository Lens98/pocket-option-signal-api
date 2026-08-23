from app.indicators.ema import calculate_ema_series


def calculate_macd(prices):

    ema12 = calculate_ema_series(prices, 12)
    ema26 = calculate_ema_series(prices, 26)

    # Align the two EMA series
    offset = len(ema12) - len(ema26)
    ema12 = ema12[offset:]

    macd_line = []

    for fast, slow in zip(ema12, ema26):
        macd_line.append(fast - slow)

    signal_line = calculate_ema_series(macd_line, 9)

    # Align MACD line with Signal line
    macd_line = macd_line[-len(signal_line):]

    current_macd = macd_line[-1]
    current_signal = signal_line[-1]
    histogram = current_macd - current_signal

    return {
        "macd": round(current_macd, 5),
        "signal": round(current_signal, 5),
        "histogram": round(histogram, 5)
    }