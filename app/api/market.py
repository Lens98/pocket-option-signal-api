from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import time
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


class AnalyzeMarketRequest(BaseModel):

    screenshot: str | None = None

    analysis_requested_at: int | None = None

    analysis_requested_at_iso: str | None = None


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

    # Set the currently received Pocket Option asset
    # as this user's active asset
    active_asset.set(user_id, data.asset)

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
def analyze_market(
    data: Optional[AnalyzeMarketRequest] = None,
    current_user: dict = Depends(get_authenticated_user),
):

    user_id = current_user["id"]

    print()
    print("========================================")
    print("ANALYZE MARKET BUTTON REQUEST")
    print("========================================")
    print("User ID:", user_id)

    asset = active_asset.get(user_id)
    # ========================================
    # LOAD CURRENT USER MARKET DATA
    # ========================================
    if not asset:

        print("RESULT: WAIT - NO ACTIVE ASSET")

        return {"action": "WAIT"}
    market = market_storage.get(user_id, asset)

    if not market or not market.candles:
        print("RESULT: WAIT - NO MARKET DATA")
        return {"action": "WAIT"}

    # ========================================
    # LOAD CURRENT USER SIGNAL
    # ========================================

    signal = signal_storage.get(user_id, asset)

    if signal is None:
        print("RESULT: WAIT - NO SIGNAL")
        return {"action": "WAIT"}

    print("Active asset:", asset)

    # ========================================
    # BINARY OPTIONS TIMING CONTEXT
    # ========================================

    analysis_requested_at = (
        data.analysis_requested_at
        if data and data.analysis_requested_at
        else int(time.time() * 1000)
    )
    last_candle = market.candles[-1]

    last_candle_timestamp = last_candle.timestamp

    # Convert timestamp safely to a number
    try:
        last_candle_timestamp = int(float(last_candle_timestamp))
    except (TypeError, ValueError):
        last_candle_timestamp = 0
    # Convert milliseconds to seconds if needed
    if last_candle_timestamp > 10_000_000_000:
        last_candle_timestamp = last_candle_timestamp / 1000

    button_timestamp = analysis_requested_at / 1000

    timeframe_seconds = int(market.timeframe)

    current_candle_end = last_candle_timestamp + timeframe_seconds

    seconds_remaining = current_candle_end - button_timestamp

    seconds_elapsed = timeframe_seconds - seconds_remaining

    # Safety boundaries
    seconds_remaining = max(0, min(timeframe_seconds, seconds_remaining))

    seconds_elapsed = max(0, min(timeframe_seconds, seconds_elapsed))

    print()
    print("========================================")
    print("BINARY OPTIONS TIMING")
    print("========================================")
    print("Timeframe seconds:", timeframe_seconds)
    print("Last candle timestamp:", last_candle_timestamp)
    print("Button pressed:", button_timestamp)
    print("Seconds elapsed:", round(seconds_elapsed, 2))
    print("Seconds remaining:", round(seconds_remaining, 2))
    print("========================================")
    # ========================================
    # SCREENSHOT VALIDATION
    # ========================================

    screenshot = data.screenshot if data else None

    if screenshot:

        print("📸 SCREENSHOT RECEIVED")

        # Safety limit: reject extremely large screenshots
        if len(screenshot) > 8_000_000:

            print("❌ SCREENSHOT TOO LARGE")

            return {"action": "WAIT", "error": "Screenshot too large"}

    else:

        print("⚠️ NO SCREENSHOT RECEIVED")

    # ========================================
    # OPENAI REVIEW
    # ========================================

    print("CALLING OPENAI REVIEWER...")

    result = engine.openai.review(
        signal,
        screenshot=screenshot,
        timeframe_seconds=timeframe_seconds,
        seconds_elapsed=seconds_elapsed,
        seconds_remaining=seconds_remaining,
    )

    # Remove local references immediately
    screenshot = None

    if data:
        data.screenshot = None

    print("OPENAI RESULT:", result)

    decision = str(result.get("decision", "WAIT")).upper()

    print("OPENAI DECISION:", decision)

    if decision not in ["CALL", "PUT", "WAIT"]:

        print("INVALID DECISION - FORCING WAIT")

        decision = "WAIT"

    print("FINAL BUTTON DECISION:", decision)
    print("========================================")

    return {"action": decision}


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
