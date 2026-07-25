class ChangeOfCharacter:

    def analyze(
        self,
        structure,
        bos
    ):

        if (
            structure == "HH_HL"
            and bos == "BEARISH_BOS"
        ):
            return "BEARISH_CHOCH"

        if (
            structure == "LH_LL"
            and bos == "BULLISH_BOS"
        ):
            return "BULLISH_CHOCH"

        return "NONE"