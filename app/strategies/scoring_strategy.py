from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

        bullish = 0.0
        bearish = 0.0

        reasons = []

        trend = "SIDEWAYS"

        # ----------------------------
        # Combine Strategy Results
        # ----------------------------

        for result in results:

            bullish += result.bullish_score
            bearish += result.bearish_score

            reasons.extend(result.reasons)

            if result.trend == "BULLISH":
                trend = "BULLISH"

            elif result.trend == "BEARISH":
                trend = "BEARISH"

        # ----------------------------
        # Confidence
        # ----------------------------

        confidence = abs(bullish - bearish)

        confidence = min(confidence, 100)

        # ----------------------------
        # Final Action
        # ----------------------------

        action = "WAIT"

        if trend == "BULLISH":

            if bullish >= settings.MIN_CONFIDENCE and bullish > bearish:

                action = "CALL"

        elif trend == "BEARISH":

            if bearish >= settings.MIN_CONFIDENCE and bearish > bullish:

                action = "PUT"

        return {

            "action": action,

            "confidence": confidence,

            "trend": trend,

            "reasons": reasons

        }