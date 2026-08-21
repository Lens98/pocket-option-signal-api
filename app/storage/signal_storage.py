from app.models.signal import Signal


class SignalStorage:

    def __init__(self):

        # Latest signal for each user + asset
        self.signals = {}

        # Latest signal globally, kept for compatibility
        self.signal = None

    # ========================================
    # UPDATE SIGNAL
    # ========================================

    def update(self, signal: Signal, user_id=None):

        self.signal = signal

        asset = getattr(signal, "asset", None)

        if not asset:
            return

        # User-specific storage
        if user_id:

            if user_id not in self.signals:
                self.signals[user_id] = {}

            self.signals[user_id][asset] = signal

            return

        # Legacy/global storage
        if "__global__" not in self.signals:
            self.signals["__global__"] = {}

        self.signals["__global__"][asset] = signal

    # ========================================
    # GET SIGNAL
    # ========================================

    def get(self, asset=None, user_id=None):

        # User-specific signal
        if user_id:

            user_signals = self.signals.get(user_id, {})

            if asset:
                return user_signals.get(asset)

            if user_signals:
                return next(reversed(user_signals.values()))

            return None

        # Legacy/global signal
        if asset:

            global_signals = self.signals.get("__global__", {})

            return global_signals.get(asset)

        return self.signal

    # ========================================
    # GET ALL SIGNALS
    # ========================================

    def all(self, user_id=None):

        if user_id:

            return dict(self.signals.get(user_id, {}))

        global_signals = self.signals.get("__global__", {})

        return dict(global_signals)

    # ========================================
    # CLEAR
    # ========================================

    def clear(self, asset=None, user_id=None):

        if user_id:

            if user_id not in self.signals:
                return

            if asset:

                self.signals[user_id].pop(asset, None)

            else:

                self.signals[user_id].clear()

            return

        if asset:

            global_signals = self.signals.get("__global__", {})

            global_signals.pop(asset, None)

            if self.signal is not None and getattr(self.signal, "asset", None) == asset:
                self.signal = None

            return

        self.signal = None
        self.signals.clear()
