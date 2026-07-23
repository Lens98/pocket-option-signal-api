from pydantic import BaseModel


class PatternResult(BaseModel):

    found: bool

    name: str

    bullish: bool

    bearish: bool

    strength: int