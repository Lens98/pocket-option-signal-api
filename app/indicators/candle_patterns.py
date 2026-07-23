from app.models.pattern import PatternFactory


class CandlePatternDetector:

    def bullish_engulfing(self, candles):

        if len(candles) < 2:
            return PatternFactory.none()

        previous = candles[-2]
        current = candles[-1]

        previous_bearish = previous.close < previous.open
        current_bullish = current.close > current.open

        engulf = (
            current.open < previous.close
            and current.close > previous.open
        )

        if previous_bearish and current_bullish and engulf:
            return PatternFactory.bullish(
                "Bullish Engulfing",
                70
            )

        return PatternFactory.none()

    def bearish_engulfing(self, candles):

        if len(candles) < 2:
            return PatternFactory.none()

        previous = candles[-2]
        current = candles[-1]

        previous_bullish = previous.close > previous.open
        current_bearish = current.close < current.open

        engulf = (
            current.open > previous.close
            and current.close < previous.open
        )

        if previous_bullish and current_bearish and engulf:
            return PatternFactory.bearish(
                "Bearish Engulfing",
                70
            )

        return PatternFactory.none()

    def detect(self, candles):

        patterns = []

        bullish = self.bullish_engulfing(candles)

        if bullish.found:
            patterns.append(bullish)

        bearish = self.bearish_engulfing(candles)

        if bearish.found:
            patterns.append(bearish)

        return patterns