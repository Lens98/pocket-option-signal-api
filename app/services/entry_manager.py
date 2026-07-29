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
        # No trade available
        # ----------------------------------------

        if signal.action == "WAIT":

            return EntryState.WAITING

        # ----------------------------------------
        # Low confidence
        # ----------------------------------------

        if signal.confidence < 70:

            return EntryState.WAITING

        # ----------------------------------------
        # Building confidence
        # ----------------------------------------

        if signal.confidence < 85:

            return EntryState.ANALYZING

        # ----------------------------------------
        # Good setup
        # ----------------------------------------

        if (
            signal.confidence >= 85
            and signal.probability >= 80
            and signal.risk != "HIGH"
        ):

            return EntryState.READY

        # ----------------------------------------
        # Enter NOW
        # ----------------------------------------

        if (
            signal.confidence >= 95
            and signal.probability >= 90
            and signal.risk == "LOW"
            and signal.action in ["CALL", "PUT"]
        ):

            return EntryState.ENTRY

        return EntryState.WAITING