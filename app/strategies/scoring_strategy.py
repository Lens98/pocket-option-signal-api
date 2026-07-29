from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

        bullish_score = 0.0
        bearish_score = 0.0

        bullish_reasons = []
        bearish_reasons = []

        # ========================================
        # Collect Scores
        # ========================================

        for result in results:

            bullish_score += result.bullish_score
            bearish_score += result.bearish_score

            if result.bullish_score > result.bearish_score:

                bullish_reasons.extend(result.reasons)

            elif result.bearish_score > result.bullish_score:

                bearish_reasons.extend(result.reasons)

        # ========================================
        # Clamp Scores
        # ========================================

        bullish_score = min(bullish_score, 100)
        bearish_score = min(bearish_score, 100)

        # ========================================
        # Calculate Trend
        # ========================================

        if bullish_score > bearish_score:

            trend = "BULLISH"

        elif bearish_score > bullish_score:

            trend = "BEARISH"

        else:

            trend = "SIDEWAYS"

        # ========================================
        # Winning Score
        # ========================================

        winning_score = max(
            bullish_score,
            bearish_score
        )

        difference = abs(
            bullish_score -
            bearish_score
        )

        # ========================================
        # Confidence
        # ========================================

        confidence = min(

            100,

            round(

                (winning_score * 0.7) +

                (difference * 0.3),

                2

            )

        )

        # ========================================
        # Probability
        # ========================================

        total = bullish_score + bearish_score

        if total == 0:

            probability = 0.0

        else:

            probability = round(

                (winning_score / total) * 100,

                2

            )

        # ========================================
        # Market Bias
        # ========================================

        bias = "WAIT"

        reasons = []

        if (

            trend == "BULLISH"

            and bullish_score >= 70

            and difference >= 15

        ):

            bias = "CALL"

            reasons = bullish_reasons

        elif (

            trend == "BEARISH"

            and bearish_score >= 70

            and difference >= 15

        ):

            bias = "PUT"

            reasons = bearish_reasons

        else:

            bias = "WAIT"

            reasons = bullish_reasons + bearish_reasons

        # ========================================
        # Debug
        # ========================================

        print()
        print("========================================")
        print("SCORING ENGINE")
        print("========================================")
        print("Bullish Score :", bullish_score)
        print("Bearish Score :", bearish_score)
        print("Difference    :", difference)
        print("Trend         :", trend)
        print("Bias          :", bias)
        print("Confidence    :", confidence)
        print("Probability   :", probability)
        print("========================================")
        print()

        return {

            "bias": bias,

            "action": bias,

            "confidence": confidence,

            "probability": probability,

            "bullish_score": bullish_score,

            "bearish_score": bearish_score,

            "difference": difference,

            "trend": trend,

            "reasons": reasons

        }