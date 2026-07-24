class EmaStrategy:

    def analyze(self, indicators):

        score = 0
        reasons = []
        trend = "SIDEWAYS"

        if indicators.ema20 > indicators.ema50 > indicators.ema200:

            trend = "BULLISH"
            score = 30

            reasons.append("EMA 20 > EMA 50 > EMA 200")

        elif indicators.ema20 < indicators.ema50 < indicators.ema200:

            trend = "BEARISH"
            score = 30

            reasons.append("EMA 20 < EMA 50 < EMA 200")

        return {
            "trend": trend,
            "score": score,
            "reasons": reasons
        }