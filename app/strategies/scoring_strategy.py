from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

        total_score = 0
        reasons = []
        trend = "SIDEWAYS"

        for result in results:

            total_score += result.get("score", 0)

            reasons.extend(result.get("reasons", []))

            if "trend" in result:
                trend = result["trend"]

        confidence = min(total_score, 100)

        action = "WAIT"

        if trend == "BULLISH" and confidence >= settings.MIN_CONFIDENCE:
            action = "CALL"

        elif trend == "BEARISH" and confidence >= settings.MIN_CONFIDENCE:
            action = "PUT"

        return {
            "action": action,
            "confidence": confidence,
            "trend": trend,
            "reasons": reasons
        }