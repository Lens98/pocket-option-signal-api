class SignalAgreement:

    def calculate(self, signal):

        score = 0

        # ==========================
        # Trend
        # ==========================

        if signal.ema_confirmed:
            score += 25

        # ==========================
        # Market Structure
        # ==========================

        if signal.structure_confirmed:
            score += 20

        # ==========================
        # Pullback
        # ==========================

        if signal.pullback_confirmed:
            score += 15

        # ==========================
        # Candle
        # ==========================

        if signal.candle_confirmed:
            score += 15

        # ==========================
        # MACD
        # ==========================

        if signal.macd_confirmed:
            score += 10

        # ==========================
        # Supply / Demand
        # ==========================

        if signal.zone_confirmed:
            score += 7

        # ==========================
        # RSI
        # ==========================

        if signal.rsi_confirmed:
            score += 5

        # ==========================
        # ADX
        # ==========================

        if signal.adx_confirmed:
            score += 2

        # ==========================
        # ATR
        # ==========================

        if signal.atr_confirmed:
            score += 1

        confirmations = sum([

            signal.ema_confirmed,

            signal.structure_confirmed,

            signal.pullback_confirmed,

            signal.candle_confirmed,

            signal.macd_confirmed,

            signal.zone_confirmed,

            signal.rsi_confirmed,

            signal.adx_confirmed,

            signal.atr_confirmed

        ])

        return {

            "agreement": score,

            "confirmations": confirmations,

            "total": 9

        }