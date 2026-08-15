from app.models.signal import Signal
from app.services.entry_manager import EntryState


class EntryEngine:

    def confirm(self, signal: Signal, state: EntryState) -> bool:

        print("----------------------------------------")
        print("ENTRY ENGINE")
        print("----------------------------------------")
        print("State       :", state.value)
        print("Bias        :", signal.bias)
        print("Confidence  :", signal.confidence)
        print("Probability :", signal.probability)
        print("Risk        :", signal.risk)
        print("----------------------------------------")

        # Default values
        signal.can_enter = False
        signal.action = "WAIT"
        signal.trade_status = state.value
        signal.entry_window = 0
        signal.countdown = 0

        # ==========================================
        # WAITING
        # ==========================================

        if state == EntryState.WAITING:

            signal.reason = "NO_MARKET_BIAS"
            signal.instruction = "No trade. Waiting for a clear market direction."

            print("❌ WAITING")
            return False

        # ==========================================
        # ANALYZING
        # ==========================================

        if state == EntryState.ANALYZING:

            signal.reason = "LOW_PROBABILITY"
            signal.instruction = "Analyzing market. Waiting for stronger confirmation."

            print("🟡 ANALYZING")
            return False

        # ==========================================
        # READY
        # ==========================================

        if state == EntryState.READY:

            signal.reason = "WAITING_PULLBACK"
            signal.instruction = "Setup detected. Waiting for a pullback."

            print("🟡 READY")
            return False

        # ==========================================
        # WAITING FOR CANDLE CLOSE
        # ==========================================

        if state == EntryState.WAITING_FOR_CANDLE_CLOSE:

            signal.can_enter = False

            # Preserve the AI prediction.
            # This is NOT an entry yet.
            if signal.bias in ["CALL", "PUT"]:

                signal.action = signal.bias

                signal.trade_status = "WAITING_FOR_CANDLE"

                signal.reason = f"NEXT CANDLE PREDICTION — {signal.bias}"

                signal.instruction = (
                    f"{signal.bias} predicted for the next "
                    "1-minute candle. Wait for the new candle "
                    "to open."
                )

            else:

                signal.action = "WAIT"

                signal.trade_status = "IDLE"

                signal.reason = "NO_MARKET_BIAS"

                signal.instruction = (
                    "No CALL/PUT prediction. Waiting for " "a clear market direction."
                )

            signal.entry_window = 0
            signal.countdown = 0

            print("----------------------------------------")
            print("🔒 NEXT 1-MINUTE PREDICTION READY")
            print("----------------------------------------")
            print("Prediction :", signal.action)
            print("Confidence :", signal.confidence)
            print("Probability:", signal.probability)
            print("Agreement  :", signal.agreement_score)
            print(
                "Confirmations:",
                f"{signal.confirmation_count}/" f"{signal.confirmation_total}",
            )
            print("Can Enter  :", signal.can_enter)
            print("Instruction:", signal.instruction)
            print("----------------------------------------")

            return False

        # ==========================================
        # ENTRY
        # ==========================================

        if state == EntryState.ENTRY:

            signal.can_enter = True
            signal.action = signal.bias
            signal.trade_status = "ENTRY"

            signal.reason = "ENTRY_CONFIRMED"
            signal.instruction = f"ENTER {signal.bias} NOW"

            # New candle = immediate entry.
            # No 5-second countdown.
            signal.entry_window = 1
            signal.countdown = 0

            print("----------------------------------------")
            print("✅ ENTRY CONFIRMED")
            print("----------------------------------------")
            print("ACTION      :", signal.action)
            print("CAN ENTER   :", signal.can_enter)
            print("ENTRY WINDOW:", signal.entry_window)
            print("COUNTDOWN   :", signal.countdown)
            print("🚀 ENTER NOW")
            print("----------------------------------------")

            return True

        # ==========================================
        # ACTIVE
        # ==========================================

        if state == EntryState.ACTIVE:

            signal.can_enter = False
            signal.action = signal.bias
            signal.trade_status = "ACTIVE"

            signal.reason = "TRADE_ACTIVE"
            signal.instruction = "Trade is currently active."

            print("🔵 TRADE ACTIVE")
            return False

        # ==========================================
        # RESULT
        # ==========================================

        if state == EntryState.RESULT:

            signal.can_enter = False
            signal.action = signal.bias
            signal.trade_status = "RESULT"

            signal.reason = "TRADE_FINISHED"
            signal.instruction = "Trade completed."

            print("🏁 TRADE FINISHED")
            return False

        # ==========================================
        # UNKNOWN STATE
        # ==========================================

        signal.reason = "UNKNOWN_STATE"
        signal.instruction = "Waiting..."

        print("❓ UNKNOWN STATE")

        return False
