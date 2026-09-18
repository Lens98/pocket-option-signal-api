from uuid import uuid4
from datetime import datetime

from app.database.trade_repository import TradeRepository
from app.models.trade import Trade

repo = TradeRepository()

trade = Trade(

    id=str(uuid4()),

    asset="EURUSD",

    timeframe="1m",

    action="CALL",

    confidence=90,

    grade="A+",

    risk="LOW",

    trend="BULLISH",

    entry_price=1.12345,

    entry_time=datetime.now(),

    expiration_seconds=60,

    reasons=["Test Trade"]

)

repo.add(trade)

print("--------------------------------")
print("Trades in Database:", repo.count())
print("--------------------------------")