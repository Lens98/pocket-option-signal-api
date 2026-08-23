from enum import Enum


class TradeState(Enum):

    WAITING = "WAITING"

    ANALYZING = "ANALYZING"

    READY = "READY"

    ENTRY = "ENTRY"

    ACTIVE = "ACTIVE"

    FINISHED = "FINISHED"

    LEARNING = "LEARNING"


class TradeStateManager:

    def __init__(self):

        self.state = TradeState.WAITING

    # ----------------------------------------

    def set(self, state: TradeState):

        self.state = state

        print("----------------------------------------")
        print("Trade State")
        print("----------------------------------------")
        print(self.state.value)
        print("----------------------------------------")

    # ----------------------------------------

    def get(self):

        return self.state

    # ----------------------------------------

    def waiting(self):

        self.set(TradeState.WAITING)

    def analyzing(self):

        self.set(TradeState.ANALYZING)

    def ready(self):

        self.set(TradeState.READY)

    def entry(self):

        self.set(TradeState.ENTRY)

    def active(self):

        self.set(TradeState.ACTIVE)

    def finished(self):

        self.set(TradeState.FINISHED)

    def learning(self):

        self.set(TradeState.LEARNING)