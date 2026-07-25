from fastapi import APIRouter

from app.models.market import MarketData
from app.models.market_update import MarketUpdate

from app.storage.market_storage import MarketStorage
from app.storage.signal_storage import SignalStorage

from app.services.trading_engine import TradingEngine

router = APIRouter()

storage = MarketStorage()
signal_storage = SignalStorage()
engine = TradingEngine()


@router.get("/health")
def health():

    return {
        "status": "running"
    }


@router.post("/market/update")
def update_market(data: MarketUpdate):

    market = MarketData(

        asset=data.asset,

        timeframe=data.timeframe,

        candles=data.candles

    )

    storage.update(market)

    signal = engine.generate_signal(market)

    signal_storage.update(signal)

    return {

        "status": "updated",

        "asset": data.asset,

        "timeframe": data.timeframe,

        "candles": len(data.candles)

    }


@router.get("/signal")
def latest_signal():

    signal = signal_storage.get()

    if signal is None:

        return {

            "status": "No signal yet"

        }

    return signal