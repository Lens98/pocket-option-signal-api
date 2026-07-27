from app.config.settings import settings


class RiskManager:

    def evaluate(self, signal):

        allowed = True
        reasons = []

        # ----------------------------------
        # Risk Score
        # ----------------------------------

        risk_score = signal.confidence

        # ----------------------------------
        # Risk Level
        # ----------------------------------

        if risk_score >= 90:

            risk = "LOW"

        elif risk_score >= settings.MIN_CONFIDENCE:

            risk = "MEDIUM"

        else:

            risk = "HIGH"

            allowed = False

            reasons.append(
                f"Confidence too low ({signal.confidence})"
            )

        # ----------------------------------
        # Trade Grade
        # ----------------------------------

        grade = "D"

        if signal.confidence >= 95 and risk == "LOW":

            grade = "A+"

        elif signal.confidence >= 90 and risk == "LOW":

            grade = "A"

        elif signal.confidence >= 80:

            grade = "B"

        elif signal.confidence >= settings.MIN_CONFIDENCE:

            grade = "C"

        return {

            "allowed": allowed,

            "risk": risk,

            "risk_score": risk_score,

            "grade": grade,

            "reasons": reasons

        }