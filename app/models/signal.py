from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Signal(BaseModel):

    # ========================================
    # Market Information
    # ========================================
    instruction: str = ""
    reason: str = ""

    asset: str

    timeframe: str

    session: str = "UNKNOWN"

    # ========================================
    # Market Direction
    # ========================================

    bias: str = "NONE"
    next_candle_bias: str = "WAIT"

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
    # AI Analysis Display Data
    # ========================================

    ema_status: str = "--"
    ema_strength: str = "--"

    rsi_status: str = "--"
    rsi_strength: str = "--"

    macd_status: str = "--"
    macd_strength: str = "--"

    volume_status: str = "--"
    volume_strength: str = "--"

    structure_status: str = "--"
    structure_strength: str = "--"

    volatility_status: str = "--"
    volatility_strength: str = "--"

    support_status: str = "--"
    support_strength: str = "--"

    liquidity_status: str = "--"
    liquidity_strength: str = "--"

    # ========================================
    # Entry Manager
    # ========================================

    market_state: str = "WAITING"

    can_enter: bool = False

    entry_window: int = 0

    countdown: int = 0

    trade_status: str = "IDLE"
    # ========================================
    # Entry Confirmations
    # ========================================

    ema_confirmed: bool = False

    macd_confirmed: bool = False

    rsi_confirmed: bool = False

    structure_confirmed: bool = False

    zone_confirmed: bool = False

    # ADX/ATR are market-quality measurements,
    # not directional CALL/PUT confirmations.
    adx_confirmed: bool = False

    atr_confirmed: bool = False

    candle_confirmed: bool = False

    pullback_confirmed: bool = False

    locked_candle_bucket: int | None = None

    # ========================================
    # Signal Agreement
    # ========================================

    agreement_score: float = 0.0

    confirmation_count: int = 0

    confirmation_total: int = 7

    # ========================================
    # Pattern Data
    # ========================================

    pattern: str = ""

    candle_pattern: str = "NONE"

    candle_strength: int = 0
