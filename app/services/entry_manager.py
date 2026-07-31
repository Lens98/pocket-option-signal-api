from enum import Enum

from app.models.signal import Signal
from app.entry.entry_engine import EntryEngine


class EntryState(str, Enum):

    WAITING = "WAITING"
    ANALYZING = "ANALYZING"
    READY = "READY"
    WAITING_FOR_CANDLE_CLOSE = "WAITING_FOR_CANDLE_CLOSE"
    ENTRY = "ENTRY"
    ACTIVE = "ACTIVE"
    RESULT = "RESULT"


class EntryManager:

    def __init__(self):

        self.engine = EntryEngine()

    def determine(self, signal: Signal) -> EntryState:

        # ----------------------------------------
        # No market direction
        # ----------------------------------------

        if signal.bias not in ["CALL", "PUT"]:
            return EntryState.WAITING

        # ----------------------------------------
        # Weak setup
        # ----------------------------------------

        if signal.confidence < 60:
            return EntryState.ANALYZING

        # ----------------------------------------
        # Setup almost ready
        # ----------------------------------------

        if signal.confidence < 75:
            return EntryState.READY

        # ----------------------------------------
        # Wait for candle close
        # ----------------------------------------

        if not signal.pullback_confirmed:
            return EntryState.WAITING_FOR_CANDLE_CLOSE

        # ----------------------------------------
        # Confirm entry with Entry Engine
        # ----------------------------------------

        if self.engine.confirm(signal):
            return EntryState.ENTRY

        # ----------------------------------------
        # Still waiting
        # ----------------------------------------

        return EntryState.WAITING_FOR_CANDLE_CLOSE