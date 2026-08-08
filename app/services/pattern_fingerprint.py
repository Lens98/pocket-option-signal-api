class PatternFingerprint:

    def build(self, signal):

        flags = [

            ("EMA", signal.ema_confirmed),
            ("MACD", signal.macd_confirmed),
            ("RSI", signal.rsi_confirmed),
            ("STRUCT", signal.structure_confirmed),
            ("ZONE", signal.zone_confirmed),
            ("ADX", signal.adx_confirmed),
            ("ATR", signal.atr_confirmed),
            ("CANDLE", signal.candle_confirmed),
            ("PULLBACK", signal.pullback_confirmed),

        ]

        active = [

            name

            for name, enabled in flags

            if enabled

        ]

        if not active:

            return "NONE"

        return "_".join(active)