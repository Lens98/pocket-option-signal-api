from app.models.signal import Signal


def generate_signal():

    return Signal(

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

            "Supply Zone"

        ]

    )