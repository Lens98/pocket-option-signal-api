from pydantic import BaseModel


class MarketRegime(BaseModel):

    regime: str

    confidence: float

    volatility: str

    trend_strength: str

    reasons: list[str]