class MacdStrategy:

    def analyze(self, indicators):

        score = 0
        reasons = []

        if indicators.macd > indicators.signal_line:
            score = 20
            reasons.append("MACD Bullish Cross")

        elif indicators.macd < indicators.signal_line:
            score = 20
            reasons.append("MACD Bearish Cross")

        return {
            "score": score,
            "reasons": reasons
        }