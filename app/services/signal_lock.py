from app.models.signal import Signal


class SignalLock:

    def __init__(self):

        self.locked = False
        self.signal: Signal | None = None
        self.lock_reason = ""

    def is_locked(self) -> bool:

        return self.locked

    def current(self) -> Signal | None:

        return self.signal

    def lock(
        self,
        signal: Signal,
        reason="ENTRY"
    ):

        self.locked = True
        self.signal = signal.model_copy(deep=True)
        self.lock_reason = reason

        print("----------------------------------------")
        print("🔒 SIGNAL LOCKED")
        print("----------------------------------------")
        print("Reason:", self.lock_reason)
        print("Bias  :", signal.bias)
        print("State :", signal.market_state)
        print("----------------------------------------")

    def unlock(self):

        self.locked = False
        self.signal = None
        self.lock_reason = ""

        print("----------------------------------------")
        print("🔓 SIGNAL UNLOCKED")
        print("----------------------------------------")