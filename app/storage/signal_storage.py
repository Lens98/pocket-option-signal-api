from app.models.signal import Signal


class SignalStorage:

    def __init__(self):

        self.signal = None
        self.signals = {}

    # ========================================
    # UPDATE SIGNAL
    # ========================================

    def update(self, signal: Signal):

        self.signal = signal

        asset = getattr(signal, "asset", None)

        if asset:

            self.signals[asset] = signal

    # ========================================
    # GET SIGNAL
    # ========================================

    def get(self, asset=None):

        if asset:

            return self.signals.get(asset)

        return self.signal

    # ========================================
    # GET ALL SIGNALS
    # ========================================

    def all(self):

        return dict(self.signals)

    # ========================================
    # CLEAR
    # ========================================

    def clear(self, asset=None):

        if asset:

            self.signals.pop(asset, None)

            if self.signal is not None and getattr(self.signal, "asset", None) == asset:

                self.signal = None

            return

        self.signal = None
        self.signals.clear()
