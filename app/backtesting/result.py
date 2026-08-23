from pydantic import BaseModel

from app.backtesting.trade import Trade


class BacktestResult(BaseModel):

    trades: list[Trade]

    wins: int

    losses: int

    win_rate: float

    total_profit: float