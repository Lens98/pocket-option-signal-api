from enum import Enum

from app.models.signal import Signal
from app.entry.entry_engine import EntryEngine


class EntryState(str, Enum):

    WAITING = "WAITING"
    ANALYZING = "ANALYZING"
    READY = "READY"
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

        if signal.bias == "WAIT":

            return EntryState.WAITING

        # ----------------------------------------
        # Market has a direction
        # ----------------------------------------

        if signal.confidence < 70:

            return EntryState.ANALYZING

        # ----------------------------------------
        # Setup is forming
        # ----------------------------------------

        if signal.confidence < 80:

            return EntryState.READY

        # ----------------------------------------
        # Ask Entry Engine
        # ----------------------------------------

        if self.engine.confirm(signal):

            return EntryState.ENTRY

        return EntryState.READY