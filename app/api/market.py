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

    print()
    print("========================================")
    print("🚀 NEW MARKET UPDATE")
    print("========================================")
    print("Asset:", data.asset)
    print("Timeframe:", data.timeframe)
    print("Candles Received:", len(data.candles))
    print("========================================")

    market = MarketData(
        asset=data.asset,
        timeframe=data.timeframe,
        candles=data.candles
    )

    # Store history
    storage.update(market)

    # Read complete history
    market = storage.get(data.asset)

    print("----------------------------------------")
    print("Stored Candles:", storage.size(data.asset))
    print("----------------------------------------")

    # Generate signal
    signal = engine.generate_signal(market)

    # Save latest signal
    signal_storage.update(signal)

    return {
        "status": "updated",
        "asset": data.asset,
        "timeframe": data.timeframe,
        "candles": len(data.candles),
        "stored": storage.size(data.asset)
    }


@router.get("/signal")
def latest_signal():

    signal = signal_storage.get()

    if signal is None:
        return {
            "status": "No signal yet"
        }

    return signal