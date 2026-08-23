class AIReasonService:

    def format(self, signal):

        sections = {

            "TREND": [],

            "MOMENTUM": [],

            "PRICE ACTION": [],

            "SUPPLY / DEMAND": [],

            "RISK": [],

            "GRADE": []

        }

        for reason in signal.reasons:

            text = reason.lower()

            # -------------------------
            # Trend
            # -------------------------

            if any(word in text for word in [

                "ema",

                "higher",

                "lower",

                "structure",

                "trend"

            ]):

                sections["TREND"].append(reason)

            # -------------------------
            # Momentum
            # -------------------------

            elif any(word in text for word in [

                "macd",

                "rsi",

                "adx",

                "momentum"

            ]):

                sections["MOMENTUM"].append(reason)

            # -------------------------
            # Candlestick
            # -------------------------

            elif any(word in text for word in [

                "hammer",

                "engulf",

                "star",

                "doji",

                "pattern"

            ]):

                sections["PRICE ACTION"].append(reason)

            # -------------------------
            # Supply Demand
            # -------------------------

            elif any(word in text for word in [

                "supply",

                "demand",

                "zone"

            ]):

                sections["SUPPLY / DEMAND"].append(reason)

            else:

                sections["TREND"].append(reason)

        sections["RISK"].append(signal.risk)

        sections["GRADE"].append(signal.grade)

        return sections