from datetime import datetime


class SessionFilter:

    def allowed(self):

        hour = datetime.utcnow().hour

        # Example: allow only 07:00–20:00 UTC
        return 7 <= hour <= 20