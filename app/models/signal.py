from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class Signal(BaseModel):

    asset: str

    timeframe: str

    action: str

    confidence: float

    trend: str

    expiration: str

    entry_price: float

    timestamp: Optional[datetime] = None

    risk: str

    reasons: List[str]