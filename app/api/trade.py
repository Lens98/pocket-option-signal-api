from fastapi import APIRouter
from pydantic import BaseModel

from app.services.win_loss_tracker import WinLossTracker
from app.storage.trade_storage import TradeStorage

router = APIRouter()

tracker = WinLossTracker()
storage = TradeStorage()


class TradeResult(BaseModel):

    trade_id: str

    exit_price: float


@router.get("/trade/latest")
def latest_trade():

    trade = storage.latest()

    if trade is None:

        return {
            "status": "No trades"
        }

    return trade


@router.get("/trade/all")
def all_trades():

    return storage.all()


@router.post("/trade/result")
def trade_result(result: TradeResult):

    trade = tracker.update_trade(
        result.trade_id,
        result.exit_price
    )

    if trade is None:

        return {
            "status": "Trade not found"
        }
    
    return trade
@router.get("/trade/statistics")
def trade_statistics():

    return storage.statistics()