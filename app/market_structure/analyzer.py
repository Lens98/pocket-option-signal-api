from app.market_structure.swing_detector import SwingDetector
from app.market_structure.bos import BreakOfStructure
from app.market_structure.choch import ChangeOfCharacter


class MarketStructureAnalyzer:

    def __init__(self):

        self.swing = SwingDetector()
        self.bos = BreakOfStructure()
        self.choch = ChangeOfCharacter()

    def analyze(self, candles):

        swing_highs, swing_lows = self.swing.find_swings(candles)

        structure = "RANGE"

        if len(swing_highs) >= 2 and len(swing_lows) >= 2:

            last_high = swing_highs[-1][1]
            previous_high = swing_highs[-2][1]

            last_low = swing_lows[-1][1]
            previous_low = swing_lows[-2][1]

            if last_high > previous_high and last_low > previous_low:
                structure = "HH_HL"

            elif last_high < previous_high and last_low < previous_low:
                structure = "LH_LL"

        bos = self.bos.analyze(
            candles,
            swing_highs,
            swing_lows
        )

        choch = self.choch.analyze(
            structure,
            bos
        )

        return {
            "structure": structure,
            "bos": bos,
            "choch": choch
        }