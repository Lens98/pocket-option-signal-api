from pydantic import BaseModel


class IndicatorResult(BaseModel):

    ema20: float
    ema50: float
    ema200: float

    rsi: float

    macd: float

    signal_line: float

    histogram: float
    
    adx: float
    atr: float