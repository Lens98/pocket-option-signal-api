from datetime import datetime, timezone


class SessionDetector:

    def detect(self):

        now = datetime.now(timezone.utc)

        hour = now.hour

        # ----------------------------------------
        # Asian Session
        # 00:00 - 08:00 UTC
        # ----------------------------------------

        if 0 <= hour < 8:

            return "ASIAN"

        # ----------------------------------------
        # London Session
        # 08:00 - 13:00 UTC
        # ----------------------------------------

        if 8 <= hour < 13:

            return "LONDON"

        # ----------------------------------------
        # London / New York Overlap
        # 13:00 - 16:00 UTC
        # ----------------------------------------

        if 13 <= hour < 16:

            return "OVERLAP"

        # ----------------------------------------
        # New York
        # 16:00 - 21:00 UTC
        # ----------------------------------------

        if 16 <= hour < 21:

            return "NEW_YORK"

        # ----------------------------------------
        # After Hours
        # ----------------------------------------

        return "AFTER_HOURS"