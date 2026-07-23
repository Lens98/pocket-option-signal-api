from pydantic import BaseModel
from typing import List

from app.models.candle import Candle


class MarketData(BaseModel):
    asset: str

    timeframe: str

    candles: List[Candle]