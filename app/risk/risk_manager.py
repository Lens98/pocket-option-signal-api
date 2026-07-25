from app.config.settings import settings


class RiskManager:

    def evaluate(self, signal):

        allowed = True
        reasons = []

        # ----------------------------
        # Determine Risk Level
        # ----------------------------

        if signal.confidence >= 80:

            risk = "LOW"

        elif signal.confidence >= settings.MIN_CONFIDENCE:

            risk = "MEDIUM"

        else:

            risk = "HIGH"

            allowed = False

            reasons.append(
                f"Confidence too low ({signal.confidence})"
            )

        return {

            "allowed": allowed,

            "risk": risk,

            "reasons": reasons

        }