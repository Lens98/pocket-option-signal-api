from pydantic import BaseModel


class StrategyResult(BaseModel):

    bullish_score: int = 0
    bearish_score: int = 0

    trend: str = "SIDEWAYS"

    reasons: list[str] = []