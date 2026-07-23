from pydantic import BaseModel
from typing import List


class Signal(BaseModel):

    asset: str

    action: str          # CALL | PUT | WAIT

    confidence: float

    trend: str

    reasons: List[str]