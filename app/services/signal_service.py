from datetime import datetime, timezone, timezone
import uuid

from app.models.signal import Signal
from app.models.trade import Trade
from app.storage.trade_storage import TradeStorage

trade_storage = TradeStorage()


def generate_signal():

    signal = Signal(
        # =====================================
        # Market
        # =====================================
        asset="EUR/USD",
        timeframe="1m",
        session="NEW YORK",
        # =====================================
        # Trade
        # =====================================
        action="WAIT",
        confidence=95.0,
        probability=80.96,
        trend="BULLISH",
        regime="TRENDING",
        expiration="Next Candle",
        # =====================================
        # Price
        # =====================================
        entry_price=1.10524,
        # =====================================
        # Risk
        # =====================================
        risk="LOW",
        grade="A+",
        # =====================================
        # AI Reasons
        # =====================================
        reasons=[
            "EMA Bullish",
            "RSI Oversold",
            "MACD Bullish Cross",
            "ADX Strong Trend",
            "ATR Low Volatility",
            "Higher High + Higher Low",
            "Bullish Break of Structure",
            "Supply Zone",
        ],
    )

    if signal.action in ("CALL", "PUT"):

        trade = Trade(
            id=str(uuid.uuid4()),
            asset=signal.asset,
            timeframe=signal.timeframe,
            action=signal.action,
            confidence=signal.confidence,
            probability=signal.probability,
            grade=signal.grade,
            risk=signal.risk,
            trend=signal.trend,
            regime=signal.regime,
            session=signal.session,
            indicator_mode="AI",
            entry_price=signal.entry_price,
            entry_time=datetime.now(timezone.utc),
            expiration_seconds=60,
            reasons=signal.reasons,
            status="OPEN",
            result=None,
            exit_price=None,
            exit_time=None,
            profit=0.0,
            payout=0.80,
        )

        trade_storage.add(trade)
    return signal
