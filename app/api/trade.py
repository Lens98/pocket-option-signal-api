from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.services.auth_dependency import get_current_user
from app.services.win_loss_tracker import WinLossTracker
from app.storage.trade_storage import TradeStorage

router = APIRouter()

tracker = WinLossTracker()
storage = TradeStorage()


class TradeResult(BaseModel):

    trade_id: str

    exit_price: float


@router.get("/trade/latest")
def latest_trade(user=Depends(get_current_user)):

    trade = storage.latest(user["id"])

    if trade is None:

        return {"status": "No trades"}

    return trade


@router.get("/trade/all")
def all_trades(user=Depends(get_current_user)):

    return storage.all(user["id"])


@router.post("/trade/result")
def trade_result(result: TradeResult, user=Depends(get_current_user)):

    trade = storage.find(result.trade_id, user["id"])

    if trade is None:

        return {"status": "Trade not found"}

    updated_trade = tracker.update_trade(result.trade_id, result.exit_price)

    if updated_trade is None:

        return {"status": "Trade not found"}

    return updated_trade


@router.get("/trade/statistics")
def trade_statistics(user=Depends(get_current_user)):

    return storage.today_statistics(user["id"])
