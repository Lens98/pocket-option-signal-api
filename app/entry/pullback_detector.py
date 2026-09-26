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
        # Pullback Distance
        # ----------------------------------------

        distance = abs(current_price - ema20)

        # Normal pullback zone = 0.15%
        normal_tolerance = abs(current_price * 0.0015)

        # Extended pullback zone = 0.30%
        extended_tolerance = abs(current_price * 0.0030)

        # ----------------------------------------
        # Debug
        # ----------------------------------------

        print("----------------------------------------")
        print("PULLBACK DETECTOR")
        print("----------------------------------------")
        print("Bias              :", bias)
        print("Price             :", current_price)
        print("EMA20             :", ema20)
        print("Distance          :", distance)
        print("Normal Tolerance  :", normal_tolerance)
        print("Extended Tolerance:", extended_tolerance)
        print("----------------------------------------")

        # ----------------------------------------
        # Invalid Bias
        # ----------------------------------------

        if bias not in ["CALL", "PUT"]:
            print("❌ No valid pullback bias")
            return False

        # ----------------------------------------
        # Normal Pullback
        # ----------------------------------------

        if distance <= normal_tolerance:

            print("🟢 NORMAL PULLBACK CONFIRMED")
            return True

        # ----------------------------------------
        # Extended Pullback
        # ----------------------------------------
        # Allow a slightly larger distance only when
        # price remains on the correct side of EMA20.
        # This prevents the detector from approving
        # a completely unrelated price move.

        if distance <= extended_tolerance:

            if bias == "CALL" and current_price >= ema20:
                print("🟢 EXTENDED CALL PULLBACK CONFIRMED")
                return True

            if bias == "PUT" and current_price <= ema20:
                print("🟢 EXTENDED PUT PULLBACK CONFIRMED")
                return True

        # ----------------------------------------
        # No Pullback
        # ----------------------------------------

        print("🟡 NO PULLBACK")
        return False