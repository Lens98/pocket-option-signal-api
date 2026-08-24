from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any
from app.api.trade import router as trade_router
from app.api.market import router as market_router
from app.api.auth import router as auth_router
from app.services.signal_service import generate_signal
from app.services.trade_monitor import TradeMonitor

from app.models.signal import Signal

trade_monitor = TradeMonitor()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market_router)
app.include_router(trade_router)
app.include_router(auth_router)


@app.on_event("startup")
async def startup():
    trade_monitor.start()


@app.get("/")
def root():
    return {"status": "API is running"}


@app.get("/get-signal", response_model=Signal)
def get_signal():
    return generate_signal()


class MarketAnalysisRequest(BaseModel):
    asset: str
    candles: List[Any]


@app.post("/analyze-market")
async def analyze_market(request: MarketAnalysisRequest):

    if not request.candles:
        return {"action": "WAIT"}

    # AI analysis will be connected here
    # For now, endpoint receives:
    # - asset
    # - live candles

    return {"action": "WAIT"}
