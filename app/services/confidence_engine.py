class ConfidenceEngine:

    def calculate(
    self,
    signal,
    agreement_score=0,
    market_quality=50,
    learning_score=50
     ):

        technical = 50.0

        # -----------------------------
        # EMA
        # -----------------------------

        if (
            "EMA Bullish" in signal.reasons
             or
             "EMA Bearish" in signal.reasons
      ):
            technical += 12

        # -----------------------------
        # RSI
        # -----------------------------

        if (
            "RSI Oversold" in signal.reasons
            or
            "RSI Overbought" in signal.reasons
        ):
            technical += 8

        elif "RSI Neutral" in signal.reasons:
            technical -= 5

        # -----------------------------
        # MACD
        # -----------------------------

        if (
            "MACD Bullish Cross" in signal.reasons
            or
            "MACD Bearish Cross" in signal.reasons
        ):
            technical += 10

        # -----------------------------
        # ADX
        # -----------------------------

        for reason in signal.reasons:

            if reason.startswith("ADX Strong"):
                technical += 12

            elif reason.startswith("ADX Moderate"):
                technical += 6

            elif reason.startswith("ADX Weak"):
                technical -= 8

        # -----------------------------
        # ATR
        # -----------------------------

        for reason in signal.reasons:

            if reason.startswith("ATR High"):
                technical += 5

            elif reason.startswith("ATR Low"):
                technical -= 5

        # -----------------------------
        # Candlestick
        # -----------------------------

        patterns = [

            "Bullish Engulfing",
            "Bearish Engulfing",
            "Hammer",
            "Shooting Star"

        ]

        for pattern in patterns:

            if pattern in signal.reasons:
                technical += 8

        # -----------------------------
        # Market Structure
        # -----------------------------

        structure = [

            "Higher High + Higher Low",
            "Lower High + Lower Low",
            "Break of Structure",
            "Change of Character"

        ]

        for item in structure:

          if item in " ".join(signal.reasons):
           technical += 8
        # -----------------------------
        # Supply / Demand
        # -----------------------------

        if "Demand Zone" in signal.reasons:
            technical += 5

        if "Supply Zone" in signal.reasons:
            technical += 5

        # -----------------------------
        # Clamp Technical
        # -----------------------------

        technical = max(0, min(technical, 100))

        # ========================================
        # Confidence Engine V2
        # ========================================

        final_confidence = (

            technical * 0.40 +

            agreement_score * 0.30 +

            market_quality * 0.20 +

            learning_score * 0.10

        )

        return round(

            max(0, min(final_confidence, 100)),

            2

        )