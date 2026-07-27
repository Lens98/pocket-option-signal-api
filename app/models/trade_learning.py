from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class TradeLearning(BaseModel):

    # ========================================
    # Trade
    # ========================================

    trade_id: str

    asset: str

    timeframe: str

    session: str

    action: str

    # ========================================
    # AI Decision
    # ========================================

    indicator_mode: str

    regime: str

    trend: str

    confidence: float

    probability: float = 0.0

    risk: str

    grade: str

    # ========================================
    # Indicators
    # ========================================

    ema20: Optional[float] = None

    ema50: Optional[float] = None

    ema200: Optional[float] = None

    rsi: Optional[float] = None

    macd: Optional[float] = None

    signal_line: Optional[float] = None

    histogram: Optional[float] = None

    adx: Optional[float] = None

    atr: Optional[float] = None

    # ========================================
    # Trade Prices
    # ========================================

    entry_price: float

    exit_price: float

    payout: float

    profit: float

    result: str

    # ========================================
    # Time
    # ========================================

    entry_time: datetime

    exit_time: datetime

    duration: float

    # ========================================
    # AI Reasons
    # ========================================

    reasons: List[str]