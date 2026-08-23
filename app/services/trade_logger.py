from uuid import uuid4
from datetime import datetime

from app.models.trade import Trade
from app.storage.trade_storage import TradeStorage


class TradeLogger:

    def __init__(self):

        self.storage = TradeStorage()

    # ----------------------------------------
    # Log New Trade
    # ----------------------------------------

    def log(self, signal):

        trade = Trade(

            id=str(uuid4()),

            asset=signal.asset,

            timeframe=signal.timeframe,

            action=signal.action,

            confidence=signal.confidence,

            probability=getattr(signal, "probability", 0.0),

            session=getattr(signal, "session", "UNKNOWN"),

            regime=getattr(signal, "regime", "UNKNOWN"),

            indicator_mode=getattr(signal, "indicator_mode", "UNKNOWN"),

            grade=signal.grade,

            risk=signal.risk,

            trend=signal.trend,

            entry_price=signal.entry_price,

            entry_time=datetime.now(),

            expiration_seconds=60,

            status="OPEN",

            result="",

            exit_price=None,

            exit_time=None,

            profit=0.0,

            payout=0.0,

            reasons=signal.reasons

        )

        self.storage.add(trade)

        return trade

    # ----------------------------------------
    # Latest Trade
    # ----------------------------------------

    def latest(self):

        return self.storage.latest()

    # ----------------------------------------
    # All Trades
    # ----------------------------------------

    def all(self):

        return self.storage.all()

    # ----------------------------------------
    # Count
    # ----------------------------------------

    def count(self):

        return self.storage.count()