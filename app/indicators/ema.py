from typing import List
from app.config.settings import settings


def calculate_ema_series(prices: List[float], period: int):

    if len(prices) < period:
        raise ValueError("Not enough prices")

    multiplier = 2 / (period + 1)

    ema_values = []

    ema = sum(prices[:period]) / period

    ema_values.append(ema)

    for price in prices[period:]:

        ema = (price - ema) * multiplier + ema

        ema_values.append(ema)

    return ema_values


def calculate_ema(prices: List[float], period: int):

    return calculate_ema_series(prices, period)[-1]