from app.models.signal import Signal


class SignalLock:

    def __init__(self):

        self.locked = False
        self.signal: Signal | None = None
        self.lock_reason = ""
        self.trade_id: str | None = None

    # ----------------------------------------
    # Check Lock
    # ----------------------------------------

    def is_locked(self) -> bool:

        return self.locked

    # ----------------------------------------
    # Current Locked Signal
    # ----------------------------------------

    def current(self) -> Signal | None:

        return self.signal

    # ----------------------------------------
    # Lock Signal
    # ----------------------------------------

    def lock(
        self,
        signal: Signal,
        reason="ENTRY",
        trade_id=None
    ):

        self.locked = True

        self.signal = signal.model_copy(
            deep=True
        )

        self.lock_reason = reason
        self.trade_id = trade_id

        print("----------------------------------------")
        print("🔒 SIGNAL LOCKED")
        print("----------------------------------------")
        print("Reason  :", self.lock_reason)
        print("Bias    :", signal.bias)
        print("Action  :", signal.action)
        print("State   :", signal.market_state)
        print("Trade ID:", self.trade_id)
        print("----------------------------------------")

    # ----------------------------------------
    # Is Active Trade Lock?
    # ----------------------------------------

    def is_trade_locked(self) -> bool:

        return (
            self.locked
            and self.lock_reason == "ACTIVE"
        )

    # ----------------------------------------
    # Activate Locked Signal
    # ----------------------------------------

    def activate(
        self,
        trade_id: str
    ):

        if not self.locked:
            return

        self.lock_reason = "ACTIVE"
        self.trade_id = trade_id

        if self.signal is not None:

            self.signal.market_state = "ACTIVE"
            self.signal.trade_status = "ACTIVE"
            self.signal.can_enter = False
            self.signal.entry_window = 0
            self.signal.countdown = 0
            self.signal.reason = "TRADE_ACTIVE"
            self.signal.instruction = (
                "Trade is currently active."
            )

        print("----------------------------------------")
        print("🔒 TRADE SIGNAL LOCKED")
        print("----------------------------------------")
        print("Trade ID:", trade_id)
        print("Bias    :", self.signal.bias if self.signal else "UNKNOWN")
        print("State   :", "ACTIVE")
        print("----------------------------------------")

    # ----------------------------------------
    # Unlock
    # ----------------------------------------

    def unlock(self):

        print("----------------------------------------")
        print("🔓 SIGNAL UNLOCKED")
        print("----------------------------------------")

        self.locked = False
        self.signal = None
        self.lock_reason = ""
        self.trade_id = None