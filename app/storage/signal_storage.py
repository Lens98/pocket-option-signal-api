from app.models.signal import Signal


class SignalStorage:

    def __init__(self):

        self.signal = None

    def update(self, signal: Signal):

        self.signal = signal

    def get(self):

        return self.signal