from app.models.signal import Signal


class EntryEngine:

    def confirm(self, signal: Signal) -> bool:

        print("----------------------------------------")
        print("ENTRY ENGINE")
        print("----------------------------------------")
        print("Bias        :", signal.bias)
        print("Confidence  :", signal.confidence)
        print("Probability :", signal.probability)
        print("Risk        :", signal.risk)
        print("----------------------------------------")

        # ----------------------------------------
        # No market direction
        # ----------------------------------------

        if signal.bias not in ["CALL", "PUT"]:

           signal.can_enter = False
           signal.reason = "NO_MARKET_BIAS"
           signal.instruction = "No trade. Wait for a clear market direction."

           print("❌ No market bias")
           return False

        # ----------------------------------------
        # Build Entry Score
        # ----------------------------------------

        score = 0

        if signal.ema_confirmed:
            score += 20

        if signal.macd_confirmed:
            score += 20

        if signal.rsi_confirmed:
            score += 10

        if signal.structure_confirmed:
            score += 15

        if signal.zone_confirmed:
            score += 10

        if signal.adx_confirmed:
            score += 10

        if signal.atr_confirmed:
            score += 5

        if signal.candle_confirmed:
            score += 5

        print("Entry Score :", score, "/100")

        # ----------------------------------------
        # Probability Check
        # ----------------------------------------

        if signal.probability < 60:

           signal.can_enter = False
           signal.reason = "LOW_PROBABILITY"
           signal.instruction = (
           "Probability is too low. Wait for a stronger setup."
           )

           print("❌ Probability too low")
           return False
        # ----------------------------------------
        # Risk Check
        # ----------------------------------------

        if signal.risk == "HIGH":

           signal.can_enter = False
           signal.reason = "HIGH_RISK"
           signal.instruction = (
           "Risk is too high. Do not enter."
        )

           print("❌ High Risk")
           return False

        # ----------------------------------------
        # Final Decision
        # ----------------------------------------

        if score >= 75 and signal.pullback_confirmed:

           signal.can_enter = True
           signal.reason = "ENTRY_CONFIRMED"
           signal.instruction = "✅ ENTER NOW"

           print("✅ ENTRY CONFIRMED")
           return True

        signal.can_enter = False

        if not signal.pullback_confirmed:

            signal.reason = "WAITING_PULLBACK"
            signal.instruction = (
                "Wait for a pullback before entering."
            )

        else:

            signal.reason = "MORE_CONFIRMATIONS"
            signal.instruction = (
                "Wait for more confirmations."
            )

        print("🟡 Waiting for more confirmations")
        return False