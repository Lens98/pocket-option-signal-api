class PatternFingerprint:

    def build(self, signal):

        pattern = []

        # -----------------------------
        # Direction
        # -----------------------------

        direction = getattr(signal, "bias", None)

        if direction not in ["CALL", "PUT"]:
            direction = getattr(signal, "action", None)

        pattern.append(
            direction or "UNKNOWN_DIRECTION"
        )

        # -----------------------------
        # Trend
        # -----------------------------

        pattern.append(
            signal.trend or "UNKNOWN_TREND"
        )

        # -----------------------------
        # Regime
        # -----------------------------

        pattern.append(
            signal.regime or "UNKNOWN_REGIME"
        )

        # -----------------------------
        # Session
        # -----------------------------

        pattern.append(
            signal.session or "UNKNOWN_SESSION"
        )

        # -----------------------------
        # Candle Pattern
        # -----------------------------

        candle_pattern = getattr(
            signal,
            "candle_pattern",
            None
        )

        if candle_pattern:

            pattern.append(
                f"CANDLE_PATTERN:{candle_pattern}"
            )

        else:

            pattern.append(
                "CANDLE_PATTERN:UNKNOWN"
            )

        # -----------------------------
        # Candle Strength
        # -----------------------------

        candle_strength = getattr(
            signal,
            "candle_strength",
            None
        )

        if candle_strength is not None:

            pattern.append(
                f"CANDLE_STRENGTH:{int(candle_strength)}"
            )

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