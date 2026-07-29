from fastapi import APIRouter

from app.models.market import MarketData
from app.models.market_update import MarketUpdate

from app.storage.shared import (
    market_storage,
    signal_storage,
    trade_state,
)

from app.services.trading_engine import TradingEngine

router = APIRouter()

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
    market_storage.update(market)

    # Read full history
    market = market_storage.get(data.asset)

    print("----------------------------------------")
    print("Stored Candles:", market_storage.size(data.asset))
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
        "stored": market_storage.size(data.asset)
    }


@router.get("/signal")
def latest_signal():

    signal = signal_storage.get()

    if signal is None:

        return {
            "status": "No signal yet"
        }

    return signal


@router.get("/market/history/{asset}")
def market_history(asset: str):

    candles = market_storage.history(asset)

    return {
        "asset": asset,
        "count": len(candles),
        "candles": candles
    }
@router.get("/trade/state")
def trade_state_status():

    return {
        "state": trade_state.get().value
    }
# ========================================
# LIVE CANDLES
# ========================================

@router.get("/candles/{asset}")
def get_candles(asset: str):

    market = market_storage.get(asset)

    if market is None:

        return []

    return market.candles