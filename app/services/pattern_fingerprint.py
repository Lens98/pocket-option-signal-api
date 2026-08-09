class PatternFingerprint:

    def build(self, signal):

        pattern = []

        # -----------------------------
        # Direction
        # -----------------------------

        pattern.append(signal.action or "UNKNOWN_ACTION")

        # -----------------------------
        # Trend
        # -----------------------------

        pattern.append(signal.trend or "UNKNOWN_TREND")

        # -----------------------------
        # Regime
        # -----------------------------

        pattern.append(signal.regime or "UNKNOWN_REGIME")

        # -----------------------------
        # Session
        # -----------------------------

        pattern.append(signal.session or "UNKNOWN_SESSION")

        # -----------------------------
        # Confirmations
        # -----------------------------

        if signal.ema_confirmed:
            pattern.append("EMA")

        if signal.macd_confirmed:
            pattern.append("MACD")

        if signal.rsi_confirmed:
            pattern.append("RSI")

        if signal.structure_confirmed:
            pattern.append("STRUCT")

        if signal.zone_confirmed:
            pattern.append("ZONE")

        if signal.pullback_confirmed:
            pattern.append("PULLBACK")

        if signal.candle_confirmed:
            pattern.append("CANDLE")

        if signal.adx_confirmed:
            pattern.append("ADX")

        if signal.atr_confirmed:
            pattern.append("ATR")

        return "|".join(pattern)