from typing import List


def calculate_ema(prices: List[float], period: int) -> float:
    """
    Calculate the Exponential Moving Average (EMA)
    """

    if len(prices) < period:
        raise ValueError("Not enough prices to calculate EMA")

    multiplier = 2 / (period + 1)

    ema = sum(prices[:period]) / period

    for price in prices[period:]:
        ema = (price - ema) * multiplier + ema

    return round(ema, 5)