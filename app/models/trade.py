from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Trade(BaseModel):

    # ========================================
    # Identity
    # ========================================

    id: str
    user_id: str
    user_id: str | None = None
    asset: str

    timeframe: str

    # ========================================
    # Trade
    # ========================================

    action: str

    confidence: float

    probability: float = 0.0

    agreement_score: float = 0.0

    grade: str

    risk: str

    trend: str

    regime: str = "UNKNOWN"

    session: str = "UNKNOWN"

    indicator_mode: str = "UNKNOWN"

    # ========================================
    # Prices
    # ========================================

    entry_price: float

    entry_time: datetime

    expiration_seconds: int

    # ========================================
    # AI Reasons
    # ========================================

    reasons: list[str]

    pattern: str = ""

    # ========================================
    # Trade Status
    # ========================================

    status: str = "OPEN"

    result: Optional[str] = None

    exit_price: Optional[float] = None

    exit_time: Optional[datetime] = None

    profit: float = 0.0

    payout: float = 0.0
