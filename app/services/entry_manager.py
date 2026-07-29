from enum import Enum

from app.models.signal import Signal


class EntryState(str, Enum):

    WAITING = "WAITING"
    ANALYZING = "ANALYZING"
    READY = "READY"
    ENTRY = "ENTRY"
    ACTIVE = "ACTIVE"
    RESULT = "RESULT"


class EntryManager:

    def determine(self, signal: Signal) -> EntryState:

        # ----------------------------------------
        # No market direction
        # ----------------------------------------

        if signal.bias not in ["CALL", "PUT"]:

            return EntryState.WAITING

        # ----------------------------------------
        # Low confidence
        # ----------------------------------------

        if signal.confidence < 70:

            return EntryState.WAITING

        # ----------------------------------------
        # Market is building
        # ----------------------------------------

        if signal.confidence < 85:

            return EntryState.ANALYZING

        # ----------------------------------------
        # Good setup
        # ----------------------------------------

        if signal.confidence < 92:

            return EntryState.READY

        # ----------------------------------------
        # High confidence
        # ----------------------------------------

        return EntryState.ENTRY