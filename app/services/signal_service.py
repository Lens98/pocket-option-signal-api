import random

from app.models.signal import Signal


def generate_signal():
    return Signal(
        asset="EUR/USD",
        signal=random.choice(["CALL", "PUT"]),
        timeframe="1m",
        confidence=random.choice(["Low", "Medium", "High"])
    )