from pydantic import BaseModel


class Account(BaseModel):

    initial_balance: float = 100.0

    balance: float = 100.0

    risk_percent: float = 0.02

    wins: int = 0

    losses: int = 0

    total_trades: int = 0