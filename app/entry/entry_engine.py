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

            print("❌ Probability too low")
            return False

        # ----------------------------------------
        # Risk Check
        # ----------------------------------------

        if signal.risk == "HIGH":

            print("❌ High Risk")
            return False

        # ----------------------------------------
        # Final Decision
        # ----------------------------------------

        if score >= 75 and signal.pullback_confirmed:

            print("✅ ENTRY CONFIRMED")
            return True

        print("🟡 Waiting for more confirmations")
        return False