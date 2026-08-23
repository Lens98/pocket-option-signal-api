class SupplyDemandDetector:

    def analyze(self, candles):

        if len(candles) < 20:

            return "NONE"

        recent = candles[-20:]

        highest = max(c.high for c in recent)

        lowest = min(c.low for c in recent)

        current = candles[-1].close

        distance_to_supply = abs(highest - current)

        distance_to_demand = abs(current - lowest)

        if distance_to_demand < distance_to_supply:

            return "DEMAND"

        elif distance_to_supply < distance_to_demand:

            return "SUPPLY"

        return "NONE"