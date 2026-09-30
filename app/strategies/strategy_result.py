from pydantic import BaseModel, Field


class StrategyResult(BaseModel):

    # ========================================
    # Scores
    # ========================================

    bullish_score: int = 0
    bearish_score: int = 0

    # ========================================
    # Market Direction
    # ========================================

    trend: str = "SIDEWAYS"

    # ========================================
    # NEXT CANDLE BINARY BIAS
    # ========================================
    #
    # CALL = next 1-minute candle candidate UP
    # PUT  = next 1-minute candle candidate DOWN
    # WAIT = no directional prediction
    #

    next_candle_bias: str = "WAIT"

    # ========================================
    # AI Reasons
    # ========================================

    reasons: list[str] = Field(default_factory=list)
