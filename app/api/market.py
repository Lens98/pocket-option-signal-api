from fastapi import APIRouter

from app.models.market import MarketData
from app.models.market_update import MarketUpdate
from datetime import datetime
from app.storage.shared import (
    market_storage,
    signal_storage,
    trade_state,
    trade_storage,
    active_asset,
)

from app.services.trading_engine import TradingEngine

router = APIRouter()

engine = TradingEngine()


@router.get("/health")
def health():

    return {"status": "running"}


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
        asset=data.asset, timeframe=data.timeframe, candles=data.candles
    )

    # Store history
    market_storage.update(market)

    # ========================================
    # Active Asset Filter
    # ========================================

    current = active_asset.get()

    if current is not None and data.asset != current:

        print("⏭ Ignoring analysis for:", data.asset, "Active:", current)

        return {"status": "stored_only", "asset": data.asset}
    # Read full history
    market = market_storage.get(data.asset)

    print("----------------------------------------")
    print("SIGNAL GENERATION INPUT")
    print("----------------------------------------")
    print("Asset:", market.asset)
    print("Timeframe:", market.timeframe)
    print("Market candles:", len(market.candles))
    print("Storage candles:", market_storage.size(data.asset))

    if market.candles:
        print("First candle:", market.candles[0].timestamp)
        print("Last candle :", market.candles[-1].timestamp)

    print("----------------------------------------")

    # Generate signal
    signal = engine.generate_signal(market)
    if signal.asset is None:
        signal.asset = data.asset

    # Save latest signal
    signal_storage.update(signal)

    return {
        "status": "updated",
        "asset": data.asset,
        "timeframe": data.timeframe,
        "candles": len(data.candles),
        "stored": market_storage.size(data.asset),
    }


@router.get("/signal")
def latest_signal():

    current = active_asset.get()

    if current is not None:

        signal = signal_storage.get(current)

    else:

        signal = signal_storage.get()

    if signal is None:

        return {"status": "No signal yet"}

    return signal


@router.get("/market/history/{asset}")
def market_history(asset: str):

    candles = market_storage.history(asset)

    return {"asset": asset, "count": len(candles), "candles": candles}


@router.get("/trade/state")
def trade_state_status():

    return {"state": trade_state.get().value}


# ========================================
# LIVE CANDLES
# ========================================


@router.get("/candles/{asset:path}")
def get_candles(asset: str):

    print("================================")
    print("GET /candles")
    print("Requested asset:", repr(asset))
    print("================================")

    market = market_storage.get(asset)

    print("Market found:", market is not None)

    if market is None:
        return []

    print("Candlestick count:", len(market.candles))

    return market.candles


# ========================================
# TRADE STATISTICS
# ========================================


@router.get("/trade/statistics")
def trade_statistics():

    stats = trade_storage.statistics()

    return {
        "wins": trade_storage.win_count(),
        "losses": trade_storage.loss_count(),
        "draws": trade_storage.draw_count(),
        "win_rate": trade_storage.win_rate(),
        "profit": stats.get("profit", 0),
    }


@router.get("/market/select/{asset}")
def select_asset(asset: str):

    active_asset.set(asset)

    return {"active_asset": asset}


@router.get("/trade/today")
def today_session():

    trades = trade_storage.all()

    today = datetime.now().date()

    today_trades = [t for t in trades if t.entry_time.date() == today]

    wins = len([t for t in today_trades if t.result == "WIN"])

    losses = len([t for t in today_trades if t.result == "LOSS"])

    total = len(today_trades)

    win_rate = round((wins / total) * 100, 2) if total > 0 else 0

    return {"trades": total, "wins": wins, "losses": losses, "win_rate": win_rate}
