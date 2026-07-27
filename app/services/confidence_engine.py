class ConfidenceEngine:

    def calculate(self, strategy):

        score = 50.0

        # -----------------------------
        # EMA
        # -----------------------------

        if "EMA Bullish" in strategy.reasons:
            score += 12

        if "EMA Bearish" in strategy.reasons:
            score += 12

        # -----------------------------
        # RSI
        # -----------------------------

        if "RSI Oversold" in strategy.reasons:
            score += 8

        elif "RSI Overbought" in strategy.reasons:
            score += 8

        elif "RSI Neutral" in strategy.reasons:
            score -= 5

        # -----------------------------
        # MACD
        # -----------------------------

        if "MACD Bullish Cross" in strategy.reasons:
            score += 10

        elif "MACD Bearish Cross" in strategy.reasons:
            score += 10

        # -----------------------------
        # ADX
        # -----------------------------

        for reason in strategy.reasons:

            if reason.startswith("ADX Strong"):
                score += 12

            elif reason.startswith("ADX Moderate"):
                score += 6

            elif reason.startswith("ADX Weak"):
                score -= 8

        # -----------------------------
        # ATR
        # -----------------------------

        for reason in strategy.reasons:

            if reason.startswith("ATR High"):
                score += 5

            elif reason.startswith("ATR Low"):
                score -= 5

        # -----------------------------
        # Candlestick Pattern
        # -----------------------------

        if "Bullish Engulfing" in strategy.reasons:
            score += 10

        if "Bearish Engulfing" in strategy.reasons:
            score += 10

        if "Hammer" in strategy.reasons:
            score += 8

        if "Shooting Star" in strategy.reasons:
            score += 8

        # -----------------------------
        # Market Structure
        # -----------------------------

        if "Higher High + Higher Low" in strategy.reasons:
            score += 8

        if "Lower High + Lower Low" in strategy.reasons:
            score += 8

        if "Break of Structure" in " ".join(strategy.reasons):
            score += 8

        if "Change of Character" in " ".join(strategy.reasons):
            score += 8

        # -----------------------------
        # Zones
        # -----------------------------

        if "Demand Zone" in strategy.reasons:
            score += 5

        if "Supply Zone" in strategy.reasons:
            score += 5

        # -----------------------------
        # Clamp
        # -----------------------------

        score = max(0, min(score, 100))

        return round(score, 2)