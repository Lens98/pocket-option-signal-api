from datetime import datetime


class SessionFilter:

    # ----------------------------------------
    # Check Trading Session
    # ----------------------------------------

    def allowed(self):

        now = datetime.utcnow()

        hour = now.hour

        weekday = now.weekday()

        # ----------------------------
        # Weekend Filter
        # ----------------------------

        if weekday >= 5:

            return {

                "allowed": False,

                "reason": "Weekend"

            }

        # ----------------------------
        # Trading Session
        # ----------------------------

        if 7 <= hour <= 20:

            return {

                "allowed": True,

                "reason": "Trading Session"

            }

        return {

            "allowed": False,

            "reason": "Outside Trading Session"

        }