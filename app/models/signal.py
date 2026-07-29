from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Signal(BaseModel):

    # ========================================
    # Market Information
    # ========================================

    asset: str

    timeframe: str

    session: str = "UNKNOWN"

    # ========================================
    # Market Direction
    # ========================================

    bias: str = "NONE"

    # ========================================
    # Current UI Action
    # ========================================

    action: str = "WAIT"

    # ========================================
    # AI Confidence
    # ========================================

    confidence: float

    probability: float = 0.0

    trend: str

    regime: str = "UNKNOWN"

    expiration: str

    # ========================================
    # Price
    # ========================================

    entry_price: float

    timestamp: Optional[datetime] = None

    # ========================================
    # Risk
    # ========================================

    risk: str

    grade: str = "N/A"

    # ========================================
    # AI Analysis
    # ========================================

    reasons: List[str] = Field(default_factory=list)

    # ========================================
    # Entry Manager
    # ========================================

    market_state: str = "WAITING"

    can_enter: bool = False

    entry_window: int = 0

    countdown: int = 0

    trade_status: str = "IDLE"