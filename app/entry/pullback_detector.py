class PullbackDetector:

    def confirm(self, market, indicators, bias):

        candles = market.candles

        # ----------------------------------------
        # Need enough candles
        # ----------------------------------------

        if len(candles) < 2:

            return False

        current_price = candles[-1].close

        ema20 = indicators.ema20

        if ema20 is None:

            return False

        # ----------------------------------------
        # Allow a small distance from EMA20
        # ----------------------------------------

        tolerance = abs(current_price * 0.0015)
        # ========================================
        # Debug
        # ========================================

        print("----------------------------------------")
        print("PULLBACK DETECTOR")
        print("----------------------------------------")
        print("Bias        :", bias)
        print("Price       :", current_price)
        print("EMA20       :", ema20)
        print("Tolerance   :", tolerance)
        print("----------------------------------------")

        # ========================================
        # CALL Pullback
        # ========================================

        if bias == "CALL":

            return (
                current_price >= ema20 - tolerance
                and
                current_price <= ema20 + tolerance
            )

        # ========================================
        # PUT Pullback
        # ========================================

        if bias == "PUT":

            return (
                current_price <= ema20 + tolerance
                and
                current_price >= ema20 - tolerance
            )

        return False