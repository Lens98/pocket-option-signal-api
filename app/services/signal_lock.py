from app.models.signal import Signal


class SignalLock:

    def __init__(self):
        self.locked = False
        self.signal: Signal | None = None

    def is_locked(self) -> bool:
        return self.locked

    def current(self) -> Signal | None:
        return self.signal

    def lock(self, signal: Signal):

        self.locked = True
        self.signal = signal

        print("----------------------------------------")
        print("🔒 SIGNAL LOCKED")
        print("----------------------------------------")
        print("Bias :", signal.bias)
        print("State:", signal.market_state)
        print("----------------------------------------")

    def unlock(self):

        self.locked = False
        self.signal = None

        print("----------------------------------------")
        print("🔓 SIGNAL UNLOCKED")
        print("----------------------------------------")