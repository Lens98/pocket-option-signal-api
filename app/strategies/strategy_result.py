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
    # AI Reasons
    # ========================================

    reasons: list[str] = Field(default_factory=list)