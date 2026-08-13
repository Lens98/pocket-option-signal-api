class ConfidenceEngine:

    def calculate(
        self,
        signal,
        agreement_score=0,
        market_quality=50,
        learning_score=50,
    ):
        technical = 50.0

        reasons = signal.reasons or []
        reason_text = " ".join(str(reason) for reason in reasons)

        # -----------------------------
        # EMA
        # -----------------------------

        if (
            "EMA Bullish" in reason_text
            or "EMA Bearish" in reason_text
            or "EMA20 Above EMA50" in reason_text
            or "EMA20 Below EMA50" in reason_text
        ):
            technical += 12

        # -----------------------------
        # RSI
        # -----------------------------

        if (
            "RSI Oversold" in reason_text
            or "RSI Overbought" in reason_text
            or "Bullish RSI Momentum" in reason_text
            or "Bearish RSI Momentum" in reason_text
        ):
            technical += 8

        elif "RSI Neutral" in reason_text:
            technical -= 5

        # -----------------------------
        # MACD
        # -----------------------------

        if (
            "MACD Bullish Cross" in reason_text
            or "MACD Bearish Cross" in reason_text
            or "MACD Above Signal" in reason_text
            or "MACD Below Signal" in reason_text
        ):
            technical += 10

        # -----------------------------
        # ADX
        # -----------------------------

        for reason in reasons:
            reason = str(reason)

            if reason.startswith("ADX Strong"):
                technical += 12

            elif reason.startswith("ADX Moderate"):
                technical += 6

            elif reason.startswith("ADX Weak"):
                technical -= 8

            elif reason.startswith("Strong Trend (ADX)"):
                technical += 12

            elif reason.startswith("Moderate Trend (ADX)"):
                technical += 6

            elif reason.startswith("Weak Trend (ADX)"):
                technical -= 8

        # -----------------------------
        # ATR
        # -----------------------------

        for reason in reasons:
            reason = str(reason)

            if reason.startswith("ATR High"):
                technical += 5

            elif reason.startswith("ATR Low"):
                technical -= 5

            elif reason == "ATR Volatility: HIGH":
                technical += 5

            elif reason == "ATR Volatility: LOW":
                technical -= 5

        # -----------------------------
        # Candlestick
        # -----------------------------

        patterns = [
            "Bullish Engulfing",
            "Bearish Engulfing",
            "Hammer",
            "Shooting Star",
            "THREE_BLACK_CROWS",
            "THREE_WHITE_SOLDIERS",
            "Three Black Crows",
            "Three White Soldiers",
        ]

        for pattern in patterns:
            if pattern in reason_text:
                technical += 8
                break

        # -----------------------------
        # Candle Strength
        # -----------------------------

        candle_strength = getattr(signal, "candle_strength", 0) or 0

        if candle_strength >= 90:
            technical += 10
        elif candle_strength >= 75:
            technical += 7
        elif candle_strength >= 60:
            technical += 4

        # -----------------------------
        # Market Structure
        # -----------------------------

        structure = [
            "Higher High + Higher Low",
            "Lower High + Lower Low",
            "Break of Structure",
            "Change of Character",
            "Bullish Break of Structure",
            "Bearish Break of Structure",
        ]

        for item in structure:
            if item in reason_text:
                technical += 8
                break

        # -----------------------------
        # Supply / Demand
        # -----------------------------

        if "Demand Zone" in reason_text:
            technical += 5

        if "Supply Zone" in reason_text:
            technical += 5

        # -----------------------------
        # Clamp Technical
        # -----------------------------

        technical = max(0, min(technical, 100))

        # ========================================
        # Confidence Engine V3
        # ========================================

        final_confidence = (
            technical * 0.40
            + agreement_score * 0.30
            + market_quality * 0.20
            + learning_score * 0.10
        )

        return round(
            max(0, min(final_confidence, 100)),
            2,
        )
