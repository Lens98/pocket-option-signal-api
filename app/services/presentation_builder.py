from app.models.signal import Signal


class PresentationBuilder:

    def build(self, signal: Signal) -> Signal:

        print("----------------------------------------")
        print("PRESENTATION BUILDER")
        print("----------------------------------------")

        # -----------------------------------------
        # Default values
        # -----------------------------------------

        if signal.action == "":
            signal.action = "WAIT"

        if signal.trade_status == "":
            signal.trade_status = "IDLE"

        if signal.reason == "":
            signal.reason = "WAITING"

        if signal.instruction == "":
            signal.instruction = "Waiting..."

        # -----------------------------------------
        # Entry Window
        # -----------------------------------------

        if signal.can_enter:

            if signal.entry_window <= 0:
                signal.entry_window = 5

        else:

            signal.entry_window = 0

        # -----------------------------------------
        # Countdown
        # -----------------------------------------

        if signal.can_enter:

            if signal.countdown <= 0:
                signal.countdown = signal.entry_window

        else:

            signal.countdown = 0

        # -----------------------------------------
        # Final Action
        # -----------------------------------------

        print("Action       :", signal.action)
        print("Instruction  :", signal.instruction)
        print("Reason       :", signal.reason)
        print("Trade Status :", signal.trade_status)
        print("Can Enter    :", signal.can_enter)
        print("Entry Window :", signal.entry_window)
        print("Countdown    :", signal.countdown)

        print("----------------------------------------")

        return signal
