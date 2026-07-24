from app.support_resistance.swing_detector import SwingDetector
from app.models.levels import Levels


class SupportResistance:

    def analyze(self, candles):

        detector = SwingDetector()

        highs, lows = detector.find_swings(candles)

        resistance = max(highs) if highs else None
        support = min(lows) if lows else None

        current = candles[-1].close

        distance_support = (
            abs(current - support)
            if support is not None
            else 999
        )

        distance_resistance = (
            abs(current - resistance)
            if resistance is not None
            else 999
        )

        return Levels(
            support=support,
            resistance=resistance,
            near_support=distance_support < 1.0,
            near_resistance=distance_resistance < 1.0,
            distance_support=round(distance_support, 5),
            distance_resistance=round(distance_resistance, 5)
        )