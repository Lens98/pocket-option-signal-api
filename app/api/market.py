from fastapi import APIRouter, Depends

from app.api.auth import get_authenticated_user
from app.models.market import MarketData
from app.models.market_update import MarketUpdate

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


# ========================================
# HEALTH
# ========================================


@router.get("/health")
def health():

    return {"status": "running"}


# ========================================
# MARKET UPDATE
# ========================================


@router.post("/market/update")
def update_market(
    data: MarketUpdate, current_user: dict = Depends(get_authenticated_user)
):

    user_id = current_user["id"]

    print()
    print("========================================")
    print("NEW MARKET UPDATE")
    print("========================================")
    print("User ID:", user_id)
    print("Asset:", data.asset)
    print("Timeframe:", data.timeframe)
    print("Candles Received:", len(data.candles))
    print("========================================")

    market = MarketData(
        asset=data.asset, timeframe=data.timeframe, candles=data.candles
    )

    # Store history for THIS authenticated user
    market_storage.update(user_id, market)

    # ========================================
    # Active Asset Filter
    # ========================================

    current = active_asset.get(user_id)

    if current is not None and data.asset != current:

        print(
            "Ignoring analysis for:", data.asset, "Active:", current, "User:", user_id
        )

        return {"status": "stored_only", "asset": data.asset}

    # Read THIS USER'S full history
    market = market_storage.get(user_id, data.asset)

    print("----------------------------------------")
    print("SIGNAL GENERATION INPUT")
    print("----------------------------------------")
    print("User ID:", user_id)
    print("Asset:", market.asset)
    print("Timeframe:", market.timeframe)
    print("Market candles:", len(market.candles))
    print("Storage candles:", market_storage.size(user_id, data.asset))

    if market.candles:

        print("First candle:", market.candles[0].timestamp)

        print("Last candle :", market.candles[-1].timestamp)

    print("----------------------------------------")

    # ========================================
    # GENERATE SIGNAL
    # DO NOT CHANGE AI LOGIC
    # ========================================

    signal = engine.generate_signal(market, user_id=user_id)

    if signal.asset is None:

        signal.asset = data.asset

    # Save latest signal for THIS USER
    signal_storage.update(user_id, signal)

    return {
        "status": "updated",
        "asset": data.asset,
        "timeframe": data.timeframe,
        "candles": len(data.candles),
        "stored": market_storage.size(user_id, data.asset),
    }


# ========================================
# LATEST SIGNAL
# ========================================


@router.get("/signal")
def latest_signal(current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    current = active_asset.get(user_id)

    if current is not None:

        signal = signal_storage.get(user_id, current)

    else:

        signal = signal_storage.get(user_id)

    if signal is None:

        return {"status": "No signal yet"}

    return signal


# ========================================
# MARKET HISTORY
# ========================================


@router.get("/market/history/{asset}")
def market_history(asset: str, current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    candles = market_storage.history(user_id, asset)

    return {"asset": asset, "count": len(candles), "candles": candles}


# ========================================
# TRADE STATE
# ========================================


# ========================================
# TRADE STATE
# ========================================


@router.get("/trade/state")
def trade_state_status(current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    return {"state": trade_state.get(user_id).value}


# ========================================
# LIVE CANDLES
# ========================================


@router.get("/candles/{asset:path}")
def get_candles(asset: str, current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    print("================================")
    print("GET /candles")
    print("User ID:", user_id)
    print("Requested asset:", repr(asset))
    print("================================")

    market = market_storage.get(user_id, asset)

    print("Market found:", len(market.candles) > 0)

    if not market.candles:

        return []

    print("Candlestick count:", len(market.candles))

    return market.candles


# ========================================
# ANALYZE MARKET ON DEMAND
# ========================================


@router.post("/analyze-market")
def analyze_market(current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    # Get this user's currently selected asset
    asset = active_asset.get(user_id)

    if not asset:
        return {"action": "WAIT"}

    # Get this user's live market data
    market = market_storage.get(user_id, asset)

    if not market or not market.candles:
        return {"action": "WAIT"}

    # ====================================
    # ANALYZE USING THE EXISTING ENGINE
    # ====================================

    result = engine.generate_signal(market, user_id=user_id)

    # ====================================
    # RETURN ONLY BUY / SELL / WAIT
    # ====================================

    if result.action == "CALL":
        return {"action": "BUY"}

    if result.action == "PUT":
        return {"action": "SELL"}

    return {"action": "WAIT"}


# ========================================
# TRADE STATISTICS
# ========================================


@router.get("/trade/statistics-overall")
def trade_statistics(current_user: dict = Depends(get_authenticated_user)):
    user_id = current_user["id"]

    stats = trade_storage.statistics(user_id)

    return {
        **stats,
        "wins": trade_storage.win_count(user_id),
        "losses": trade_storage.loss_count(user_id),
        "draws": trade_storage.draw_count(user_id),
        "win_rate": trade_storage.win_rate(user_id),
        "profit": stats.get("profit", 0),
    }


# ========================================
# SELECT ACTIVE ASSET
# ========================================


@router.get("/market/select/{asset}")
def select_asset(asset: str, current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    active_asset.set(user_id, asset)

    return {"active_asset": asset}


# ========================================
# TODAY'S SESSION
# ========================================


@router.get("/trade/today")
def today_session(current_user: dict = Depends(get_authenticated_user)):

    user_id = current_user["id"]

    return trade_storage.today_statistics(user_id)
