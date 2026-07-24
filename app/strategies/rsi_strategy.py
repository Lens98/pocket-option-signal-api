class RsiStrategy:

    def analyze(self, indicators):

        score = 0
        reasons = []

        if indicators.rsi < 30:
            score = 20
            reasons.append("RSI Oversold")

        elif indicators.rsi > 70:
            score = 20
            reasons.append("RSI Overbought")

        return {
            "score": score,
            "reasons": reasons
        }