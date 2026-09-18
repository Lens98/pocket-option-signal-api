class MultiTimeframeFilter:

    def evaluate(
        self,
        trend_1m,
        trend_5m,
        trend_15m
    ):

        print("----------------------------------------")
        print("Multi-Timeframe Filter")
        print("----------------------------------------")
        print("1m :", trend_1m)
        print("5m :", trend_5m)
        print("15m:", trend_15m)
        print("----------------------------------------")

        # ========================================
        # Stage 1
        # Only 1m is ready
        # ========================================

        if trend_5m == "UNKNOWN":

            if trend_1m in ("BULLISH", "BEARISH"):

                return {

                    "allowed": True,

                    "stage": 1,

                    "confidence_bonus": 5,

                    "reason": "Using 1m trend only"

                }

            return {

                "allowed": False,

                "stage": 1,

                "confidence_bonus": 0,

                "reason": "1m trend not confirmed"

            }

        # ========================================
        # Stage 2
        # 1m + 5m
        # ========================================

        if trend_15m == "UNKNOWN":

            if (

                trend_1m == trend_5m

                and

                trend_1m != "SIDEWAYS"

            ):

                return {

                    "allowed": True,

                    "stage": 2,

                    "confidence_bonus": 10,

                    "reason": "1m and 5m agree"

                }

            return {

                "allowed": False,

                "stage": 2,

                "confidence_bonus": 0,

                "reason": "1m and 5m disagree"

            }

        # ========================================
        # Stage 3
        # 1m + 5m + 15m
        # ========================================

        if (

            trend_1m == trend_5m == trend_15m

            and

            trend_1m != "SIDEWAYS"

        ):

            return {

                "allowed": True,

                "stage": 3,

                "confidence_bonus": 15,

                "reason": "All timeframes agree"

            }

        return {

            "allowed": False,

            "stage": 3,

            "confidence_bonus": 0,

            "reason": "Timeframes do not agree"

        }