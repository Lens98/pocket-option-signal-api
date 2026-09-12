from app.services.indicator_service import IndicatorService


class TrendAnalyzer:

    def __init__(self):

        self.indicators = IndicatorService()

    def analyze(self, market):

        candles = market.candles

        if len(candles) < 2:
            return "UNKNOWN"

        try:
            indicator = self.indicators.calculate(market)
        except Exception:
            return "UNKNOWN"

        print("----------------------------------------")
        print("Trend Analyzer")
        print("----------------------------------------")
        print("Mode :", indicator.mode)

        # ========================================
        # STARTUP MODE
        # EMA20 + Price Direction
        # ========================================

        if indicator.mode == "STARTUP":

            first = candles[0].close
            last = candles[-1].close

            print("EMA20 :", indicator.ema20)

            if indicator.ema20 is not None:

                if last > indicator.ema20 and last > first:

                    print("Trend : BULLISH")
                    return "BULLISH"

                if last < indicator.ema20 and last < first:

                    print("Trend : BEARISH")
                    return "BEARISH"

            if last > first:

                print("Trend : BULLISH (price action)")
                return "BULLISH"

            if last < first:

                print("Trend : BEARISH (price action)")
                return "BEARISH"

            print("Trend : SIDEWAYS")
            return "SIDEWAYS"

        # ========================================
        # STANDARD MODE
        # EMA20 vs EMA50
        # ========================================

        elif indicator.mode == "STANDARD":

            print("EMA20 :", indicator.ema20)
            print("EMA50 :", indicator.ema50)

            if (
                indicator.ema20 is not None
                and
                indicator.ema50 is not None
            ):

                if indicator.ema20 > indicator.ema50:

                    print("Trend : BULLISH")
                    return "BULLISH"

                if indicator.ema20 < indicator.ema50:

                    print("Trend : BEARISH")
                    return "BEARISH"

            print("Trend : SIDEWAYS")
            return "SIDEWAYS"

        # ========================================
        # ADVANCED MODE
        # EMA20 + EMA50 + ADX
        # ========================================

        elif indicator.mode == "ADVANCED":

            print("EMA20 :", indicator.ema20)
            print("EMA50 :", indicator.ema50)
            print("ADX   :", indicator.adx)

            if (
                indicator.ema20 is not None
                and
                indicator.ema50 is not None
            ):

                if indicator.ema20 > indicator.ema50:
                    return "BULLISH"

                if indicator.ema20 < indicator.ema50:
                    return "BEARISH"

            return "SIDEWAYS"

        # ========================================
        # FULL MODE
        # EMA20 > EMA50 > EMA200
        # ========================================

        print("EMA20  :", indicator.ema20)
        print("EMA50  :", indicator.ema50)
        print("EMA200 :", indicator.ema200)

        if (
            indicator.ema20 is not None
            and
            indicator.ema50 is not None
            and
            indicator.ema200 is not None
        ):

            if (
                indicator.ema20
                >
                indicator.ema50
                >
                indicator.ema200
            ):

                print("Trend : BULLISH")
                return "BULLISH"

            if (
                indicator.ema20
                <
                indicator.ema50
                <
                indicator.ema200
            ):

                print("Trend : BEARISH")
                return "BEARISH"

        print("Trend : SIDEWAYS")
        return "SIDEWAYS"