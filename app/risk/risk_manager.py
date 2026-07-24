from app.config.settings import settings


class RiskManager:

    def evaluate(self, signal):

        allowed = True
        reasons = []

        if signal.confidence < settings.MIN_CONFIDENCE:

            allowed = False

            reasons.append(
                f"Confidence too low ({signal.confidence})"
            )

        return {
            "allowed": allowed,
            "reasons": reasons
        }