from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

    bullish = 0.0
    bearish = 0.0

    reasons = []

    trend = "SIDEWAYS"

    for result in results:

        bullish += float(result.bullish_score)

        bearish += float(result.bearish_score)

        reasons.extend(result.reasons)

        if result.trend != "SIDEWAYS":

            trend = result.trend

    total = bullish + bearish

    if total == 0:

        confidence = 0.0

    else:

        confidence = round(

            max(bullish, bearish)

            / total

            * 100,

            1

        )

    action = "WAIT"

    if (

        trend == "BULLISH"

        and bullish > bearish

        and confidence >= settings.MIN_CONFIDENCE

    ):

        action = "CALL"

    elif (

        trend == "BEARISH"

        and bearish > bullish

        and confidence >= settings.MIN_CONFIDENCE

    ):

        action = "PUT"

    return {

        "action": action,

        "confidence": confidence,

        "trend": trend,

        "bullish_score": round(bullish, 1),

        "bearish_score": round(bearish, 1),

        "reasons": reasons

    }