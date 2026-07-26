from app.config.settings import settings


class RiskManager:

    def evaluate(self, signal):

    allowed = True

    reasons = []

    risk_score = 100

    # ---------------------------------
    # Confidence
    # ---------------------------------

    if signal.confidence >= 90:

        risk_score -= 40

    elif signal.confidence >= 80:

        risk_score -= 30

    elif signal.confidence >= 70:

        risk_score -= 20

    elif signal.confidence >= settings.MIN_CONFIDENCE:

        risk_score -= 10

    else:

        reasons.append(
            f"Low confidence ({signal.confidence}%)"
        )

    # ---------------------------------
    # Trend
    # ---------------------------------

    if signal.trend == "BULLISH":

        risk_score -= 10

    elif signal.trend == "BEARISH":

        risk_score -= 10

    else:

        risk_score += 10

        reasons.append(
            "Sideways trend"
        )

    # ---------------------------------
    # Risk Level
    # ---------------------------------

    if risk_score <= 30:

        risk = "LOW"

    elif risk_score <= 60:

        risk = "MEDIUM"

    else:

        risk = "HIGH"

        allowed = False

        reasons.append(
            "Risk score too high"
        )

  # ---------------------------------
# Trade Grade
# ---------------------------------

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