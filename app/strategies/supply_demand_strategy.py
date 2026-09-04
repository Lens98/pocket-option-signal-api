from app.strategies.strategy_result import StrategyResult
from app.config.weights import Weights


class SupplyDemandStrategy:

    def analyze(self, zone):

        result = StrategyResult()

        # ========================================
        # Backward Compatibility
        # ========================================

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

        # ========================================
        # Advanced Zone Object
        # ========================================

        zone_type = zone.get("type", "NONE")
        strength = zone.get("strength", 0)
        fresh = zone.get("fresh", False)
        tested = zone.get("tested", False)
        broken = zone.get("broken", False)

        # ========================================
        # Demand Zone
        # ========================================

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

            if tested:

                result.bullish_score += 2

                result.reasons.append(
                    "Demand Zone Retest"
                )

            if broken:

                result.bearish_score += 5

                result.reasons.append(
                    "Demand Zone Broken"
                )

        # ========================================
        # Supply Zone
        # ========================================

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

            if tested:

                result.bearish_score += 2

                result.reasons.append(
                    "Supply Zone Retest"
                )

            if broken:

                result.bullish_score += 5

                result.reasons.append(
                    "Supply Zone Broken"
                )

        else:

            result.reasons.append(
                "No Supply/Demand Zone"
            )

        # ========================================
        # Score Limits
        # ========================================

        result.bullish_score = min(
            result.bullish_score,
            20
        )

        result.bearish_score = min(
            result.bearish_score,
            20
        )

        return result