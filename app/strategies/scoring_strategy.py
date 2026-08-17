from app.config.settings import settings


class ScoringStrategy:

    def calculate(self, results):

        bullish_score = 0
        bearish_score = 0

        bullish_reasons = []
        bearish_reasons = []
        candle_next_bias = "WAIT"

        # ========================================
        # Collect Results (Bias Aware)
        # ========================================

        BULLISH_KEYWORDS = [
            "Bullish",
            "Higher High",
            "Demand Zone",
            "EMA20 Above",
            "EMA50 Above",
            "MACD Above",
            "Oversold",
            "Hammer",
        ]

        BEARISH_KEYWORDS = [
            "Bearish",
            "Lower High",
            "Supply Zone",
            "EMA20 Below",
            "EMA50 Below",
            "MACD Below",
            "Overbought",
            "Shooting Star",
        ]

        NEUTRAL_KEYWORDS = ["ATR", "ADX", "Volatility", "Regime"]

        for result in results:
            # ----------------------------------------
            # Candlestick next-candle prediction
            # ----------------------------------------

            result_candle_bias = getattr(
                result,
                "next_candle_bias",
                "WAIT",
            )

            if result_candle_bias in ["CALL", "PUT"]:

                candle_next_bias = result_candle_bias

            # ADX and ATR measure market quality,
            # NOT CALL/PUT direction.
            is_neutral = any(
                keyword in reason
                for reason in result.reasons
                for keyword in NEUTRAL_KEYWORDS
            )

            if not is_neutral:
                bullish_score += result.bullish_score
                bearish_score += result.bearish_score

            for reason in result.reasons:

                if any(word in reason for word in BULLISH_KEYWORDS):

                    bullish_reasons.append(reason)

                elif any(word in reason for word in BEARISH_KEYWORDS):

                    bearish_reasons.append(reason)

                elif any(word in reason for word in NEUTRAL_KEYWORDS):

                    bullish_reasons.append(reason)
                    bearish_reasons.append(reason)
        # ========================================
        # Clamp Scores
        # ========================================

        bullish_score = min(bullish_score, 100)
        bearish_score = min(bearish_score, 100)

        # ========================================
        # Difference
        # ========================================

        difference = bullish_score - bearish_score

        # ========================================
        # Binary Direction Threshold
        # ========================================

        MIN_DIRECTIONAL_EDGE = 10

        if difference >= MIN_DIRECTIONAL_EDGE:

            bias = "CALL"
            trend = "BULLISH"
            reasons = bullish_reasons

        elif difference <= -MIN_DIRECTIONAL_EDGE:

            bias = "PUT"
            trend = "BEARISH"
            reasons = bearish_reasons

        else:

            bias = "WAIT"
            trend = "SIDEWAYS"
            reasons = bullish_reasons + bearish_reasons

        # ========================================
        # Confidence
        # ========================================

        winning_score = max(bullish_score, bearish_score)

        confidence = round((winning_score * 0.70) + (abs(difference) * 0.30), 2)

        confidence = min(confidence, 100)

        # ========================================
        # Probability
        # ========================================

        total = bullish_score + bearish_score

        if total == 0:

            probability = 50.0

        else:

            probability = round((winning_score / total) * 100, 2)

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
        print("Bias          :", bias)
        print("Confidence    :", confidence)
        print("Probability   :", probability)
        print("========================================")
        print()

        return {
            "bias": bias,
            "candle_next_bias": candle_next_bias,
            "action": bias,
            "trend": trend,
            "confidence": confidence,
            "probability": probability,
            "bullish_score": bullish_score,
            "bearish_score": bearish_score,
            "reasons": reasons,
        }
