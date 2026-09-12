from typing import Optional

from pydantic import BaseModel


class IndicatorResult(BaseModel):

    # ----------------------------------------
    # Indicator Mode
    # ----------------------------------------

    mode: str

    # ----------------------------------------
    # Moving Averages
    # ----------------------------------------

    ema20: Optional[float] = None

    ema50: Optional[float] = None

    ema200: Optional[float] = None

    # ----------------------------------------
    # RSI
    # ----------------------------------------

    rsi: Optional[float] = None

    # ----------------------------------------
    # MACD
    # ----------------------------------------

    macd: Optional[float] = None

    signal_line: Optional[float] = None

    histogram: Optional[float] = None

    # ----------------------------------------
    # Trend Strength
    # ----------------------------------------

    adx: Optional[float] = None

    atr: Optional[float] = None