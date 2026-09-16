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

        # ==========================================
        # DEFAULT VALUES
        # ==========================================

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
        # CONFIRMING
        # ==========================================

        if state == EntryState.CONFIRMING:

            signal.can_enter = False
            signal.action = "WAIT"
            signal.trade_status = "CONFIRMING"

            # --------------------------------------
            # Validate prediction
            # --------------------------------------

            if signal.next_candle_bias not in ["CALL", "PUT"]:

                signal.reason = "NO_NEXT_CANDLE_PREDICTION"

                signal.instruction = (
                    "Confirmation in progress. "
                    "Waiting for a valid CALL/PUT prediction."
                )

                print("----------------------------------------")
                print("🟡 CONFIRMING")
                print("----------------------------------------")
                print("Next Candle Bias :", signal.next_candle_bias)
                print("Action           :", signal.action)
                print("Can Enter        :", signal.can_enter)
                print("Reason           :", signal.reason)
                print("----------------------------------------")

                return False

            # --------------------------------------
            # Confirmation gates
            # --------------------------------------

            probability = float(signal.probability or 0)
            agreement = float(signal.agreement_score or 0)

            confirmation_count = int(signal.confirmation_count or 0)

            confirmation_total = int(signal.confirmation_total or 0)

            # --------------------------------------
            # Minimum probability
            # --------------------------------------

            if probability < 60:

                signal.reason = "LOW_PROBABILITY"

                signal.instruction = (
                    "Confirmation is not strong enough. "
                    "Waiting for higher probability."
                )

                print("----------------------------------------")
                print("🟡 CONFIRMING — LOW PROBABILITY")
                print("----------------------------------------")
                print("Probability :", probability)
                print("Required    : 60")
                print("----------------------------------------")

                return False

            # --------------------------------------
            # Minimum agreement
            # --------------------------------------

            if agreement < 70:

                signal.reason = "LOW_AGREEMENT"

                signal.instruction = (
                    "Confirmation is not strong enough. "
                    "Waiting for stronger indicator agreement."
                )

                print("----------------------------------------")
                print("🟡 CONFIRMING — LOW AGREEMENT")
                print("----------------------------------------")
                print("Agreement :", agreement)
                print("Required  : 70")
                print("----------------------------------------")

                return False

            # --------------------------------------
            # Minimum confirmations
            # --------------------------------------
            MIN_CONFIRMATIONS = 4

            if confirmation_count < MIN_CONFIRMATIONS:

                signal.reason = "INSUFFICIENT_CONFIRMATIONS"

                signal.instruction = "Waiting for additional confirmation."

                print("----------------------------------------")
                print("🟡 CONFIRMING — INSUFFICIENT CONFIRMATIONS")
                print("----------------------------------------")
                print(
                    "Confirmations:",
                    f"{confirmation_count}/{confirmation_total}",
                )
                print(
                    "Required:",
                    MIN_CONFIRMATIONS,
                )
                print("----------------------------------------")

                return False
            # --------------------------------------
            # LOCK NEXT CANDLE PREDICTION
            # --------------------------------------

            signal.action = signal.next_candle_bias
            signal.trade_status = "WAITING_FOR_CANDLE"

            signal.reason = f"NEXT CANDLE PREDICTION — " f"{signal.next_candle_bias}"

            signal.instruction = (
                f"{signal.next_candle_bias} predicted for the "
                "next 1-minute candle. "
                "Wait for the new candle to open."
            )

            signal.entry_window = 0
            signal.countdown = 0

            print("----------------------------------------")
            print("🔒 1-MINUTE PREDICTION LOCKED")
            print("----------------------------------------")
            print("Prediction      :", signal.next_candle_bias)
            print("Bias            :", signal.bias)
            print("Confidence      :", signal.confidence)
            print("Probability     :", probability)
            print("Agreement       :", agreement)
            print(
                "Confirmations   :",
                f"{confirmation_count}/{confirmation_total}",
            )
            print("State           :", state.value)
            print("Trade Status    :", signal.trade_status)
            print("Can Enter       :", signal.can_enter)
            print("----------------------------------------")
            print("⏳ WAIT FOR NEW CANDLE")
            print("----------------------------------------")

            return False

        # ==========================================
        # WAITING FOR CANDLE CLOSE
        # ==========================================

        if state == EntryState.WAITING_FOR_CANDLE_CLOSE:

            signal.can_enter = False

            # Preserve the AI prediction.
            # This is NOT an entry yet.
            if signal.next_candle_bias in ["CALL", "PUT"]:

                signal.action = signal.next_candle_bias

                signal.trade_status = "WAITING_FOR_CANDLE"

                signal.reason = (
                    f"NEXT CANDLE PREDICTION — " f"{signal.next_candle_bias}"
                )

                signal.instruction = (
                    f"{signal.next_candle_bias} predicted for the next "
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

            # --------------------------------------
            # HARD VALIDATION
            # --------------------------------------

            if signal.next_candle_bias not in ["CALL", "PUT"]:

                signal.can_enter = False
                signal.action = "WAIT"
                signal.trade_status = "IDLE"
                signal.entry_window = 0
                signal.countdown = 0

                signal.reason = "INVALID_ENTRY_BIAS"
                signal.instruction = "No valid CALL/PUT prediction. Waiting."

                print("----------------------------------------")
                print("❌ ENTRY BLOCKED")
                print("----------------------------------------")
                print(
                    "Invalid Next Candle Bias :",
                    signal.next_candle_bias,
                )
                print("----------------------------------------")

                return False

            # --------------------------------------
            # VALID BINARY ENTRY
            # --------------------------------------

            signal.can_enter = True
            signal.action = signal.next_candle_bias
            signal.trade_status = "ENTRY"

            signal.reason = "ENTRY_CONFIRMED"
            signal.instruction = f"ENTER {signal.action} NOW"

            signal.entry_window = 1
            signal.countdown = 0

            print("----------------------------------------")
            print("✅ ENTRY CONFIRMED")
            print("----------------------------------------")
            print("BIAS        :", signal.bias)
            print("NEXT BIAS   :", signal.next_candle_bias)
            print("ACTION      :", signal.action)
            print("CAN ENTER   :", signal.can_enter)
            print("ENTRY WINDOW:", signal.entry_window)
            print("COUNTDOWN   :", signal.countdown)
            print("🚀 ENTER", signal.action, "NOW")
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
