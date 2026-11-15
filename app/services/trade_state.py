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

        self.states = {}

    # ----------------------------------------
    # SET USER STATE
    # ----------------------------------------

    def set(self, user_id, state: TradeState):

        self.states[user_id] = state

        print("----------------------------------------")
        print("Trade State")
        print("----------------------------------------")
        print("User ID:", user_id)
        print("State:", state.value)
        print("----------------------------------------")

    # ----------------------------------------
    # GET USER STATE
    # ----------------------------------------

    def get(self, user_id):

        return self.states.get(user_id, TradeState.WAITING)

    # ----------------------------------------

    def waiting(self, user_id):

        self.set(user_id, TradeState.WAITING)

    def analyzing(self, user_id):

        self.set(user_id, TradeState.ANALYZING)

    def ready(self, user_id):

        self.set(user_id, TradeState.READY)

    def entry(self, user_id):

        self.set(user_id, TradeState.ENTRY)

    def active(self, user_id):

        self.set(user_id, TradeState.ACTIVE)

    def finished(self, user_id):

        self.set(user_id, TradeState.FINISHED)

    def learning(self, user_id):

        self.set(user_id, TradeState.LEARNING)
