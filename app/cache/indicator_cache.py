from pydantic import BaseModel


class IndicatorCache(BaseModel):

    ema20: list[float] = []

    ema50: list[float] = []

    ema200: list[float] = []

    rsi: list[float] = []

    macd: list[float] = []

    signal: list[float] = []

    histogram: list[float] = []