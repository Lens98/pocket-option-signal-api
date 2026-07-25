from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

        bullish = 0
        bearish = 0

        reasons = []

        trend = "SIDEWAYS"

        for result in results:

            bullish += result.bullish_score
            bearish += result.bearish_score

            reasons.extend(result.reasons)

            if result.trend != "SIDEWAYS":
                trend = result.trend

        action = "WAIT"

        confidence = abs(bullish - bearish)

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