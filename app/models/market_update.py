from typing import List

from pydantic import BaseModel

from app.models.candle import Candle


class MarketUpdate(BaseModel):

    asset: str

    timeframe: str

    candles: List[Candle]