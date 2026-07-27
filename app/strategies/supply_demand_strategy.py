from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class SupplyDemandStrategy:

    def analyze(self, zone):

        result = StrategyResult()

        # ----------------------------------
        # Backward Compatibility
        # ----------------------------------

        if isinstance(zone, str):

            if zone == "DEMAND":

                result.trend = "BULLISH"

                result.bullish_score += Weights.SUPPLY_DEMAND

                result.reasons.append(
                    "Demand Zone"
                )

            elif zone == "SUPPLY":

                result.trend = "BEARISH"

                result.bearish_score += Weights.SUPPLY_DEMAND

                result.reasons.append(
                    "Supply Zone"
                )

            else:

                result.reasons.append(
                    "No Supply/Demand Zone"
                )

            return result

        # ----------------------------------
        # Future Advanced Zone Object
        # ----------------------------------

        zone_type = zone.get("type", "NONE")
        strength = zone.get("strength", 0)
        fresh = zone.get("fresh", False)

        if zone_type == "DEMAND":

            result.trend = "BULLISH"

            result.bullish_score += Weights.SUPPLY_DEMAND

            result.reasons.append(
                "Demand Zone"
            )

            if strength >= 80:

                result.bullish_score += 5

                result.reasons.append(
                    "Strong Demand Zone"
                )

            elif strength >= 60:

                result.bullish_score += 2

                result.reasons.append(
                    "Moderate Demand Zone"
                )

            if fresh:

                result.bullish_score += 3

                result.reasons.append(
                    "Fresh Demand Zone"
                )

        elif zone_type == "SUPPLY":

            result.trend = "BEARISH"

            result.bearish_score += Weights.SUPPLY_DEMAND

            result.reasons.append(
                "Supply Zone"
            )

            if strength >= 80:

                result.bearish_score += 5

                result.reasons.append(
                    "Strong Supply Zone"
                )

            elif strength >= 60:

                result.bearish_score += 2

                result.reasons.append(
                    "Moderate Supply Zone"
                )

            if fresh:

                result.bearish_score += 3

                result.reasons.append(
                    "Fresh Supply Zone"
                )

        else:

            result.reasons.append(
                "No Supply/Demand Zone"
            )

        return result