from typing import List


def calculate_rsi(prices: List[float], period: int = 14) -> float:
    if len(prices) < period + 1:
        raise ValueError("Not enough prices to calculate RSI")

    gains = []
    losses = []

    for i in range(1, period + 1):
        change = prices[i] - prices[i - 1]

        if change > 0:
            gains.append(change)
            losses.append(0)
        else:
            gains.append(0)
            losses.append(abs(change))

    average_gain = sum(gains) / period
    average_loss = sum(losses) / period

    if average_loss == 0:
        return 100

    rs = average_gain / average_loss

    rsi = 100 - (100 / (1 + rs))

    return round(rsi, 2)