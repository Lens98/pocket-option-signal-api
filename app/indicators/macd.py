from app.indicators.ema import calculate_ema


def calculate_macd(prices):

    if len(prices) < 35:
        raise ValueError("Not enough prices to calculate MACD")

    macd_values = []

    # Build the MACD line
    for i in range(26, len(prices) + 1):

        data = prices[:i]

        ema12 = calculate_ema(data, 12)
        ema26 = calculate_ema(data, 26)

        macd = ema12 - ema26

        macd_values.append(macd)

    # Signal line (9 EMA of MACD values)
    signal = calculate_ema(macd_values, 9)

    current_macd = macd_values[-1]

    histogram = current_macd - signal

    return {
        "macd": round(current_macd, 5),
        "signal": round(signal, 5),
        "histogram": round(histogram, 5)
    }