class SupportStrategy:

    def analyze(self, levels):

        score = 0
        reasons = []

        if levels.near_support:
            score += 15
            reasons.append("Price near support")

        if levels.near_resistance:
            score -= 15
            reasons.append("Price near resistance")

        return {
            "score": score,
            "reasons": reasons
        }