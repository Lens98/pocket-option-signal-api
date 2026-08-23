class CandleStrategy:

    # ==========================================================
    # Main Analyzer
    # ==========================================================

    def analyze(self, candles):

        result = {
            "pattern": "NONE",
            "direction": "WAIT",
            "strength": 0,
            "confirmed": False,
            "can_trade": False
        }

        if len(candles) < 2:
            return result

        # ======================================================
        # THREE-CANDLE PATTERNS
        # ======================================================

        if self.morning_star(candles):

            return {
                "pattern": "MORNING_STAR",
                "direction": "CALL",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            }

        if self.evening_star(candles):

            return {
                "pattern": "EVENING_STAR",
                "direction": "PUT",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_white_soldiers(candles):

            return {
                "pattern": "THREE_WHITE_SOLDIERS",
                "direction": "CALL",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_black_crows(candles):

            return {
                "pattern": "THREE_BLACK_CROWS",
                "direction": "PUT",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_inside_up(candles):

            return {
                "pattern": "THREE_INSIDE_UP",
                "direction": "CALL",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_inside_down(candles):

            return {
                "pattern": "THREE_INSIDE_DOWN",
                "direction": "PUT",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_outside_up(candles):

            return {
                "pattern": "THREE_OUTSIDE_UP",
                "direction": "CALL",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        if self.three_outside_down(candles):

            return {
                "pattern": "THREE_OUTSIDE_DOWN",
                "direction": "PUT",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        # ======================================================
        # TWO-CANDLE PATTERNS
        # ======================================================

        if self.bullish_engulfing(candles):

            return {
                "pattern": "BULLISH_ENGULFING",
                "direction": "CALL",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        if self.bearish_engulfing(candles):

            return {
                "pattern": "BEARISH_ENGULFING",
                "direction": "PUT",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            }

        if self.piercing_line(candles):

            return {
                "pattern": "PIERCING_LINE",
                "direction": "CALL",
                "strength": 88,
                "confirmed": True,
                "can_trade": True
            }

        if self.dark_cloud_cover(candles):

            return {
                "pattern": "DARK_CLOUD_COVER",
                "direction": "PUT",
                "strength": 88,
                "confirmed": True,
                "can_trade": True
            }

        if self.bullish_harami(candles):

            return {
                "pattern": "BULLISH_HARAMI",
                "direction": "CALL",
                "strength": 82,
                "confirmed": True,
                "can_trade": True
            }

        if self.bearish_harami(candles):

            return {
                "pattern": "BEARISH_HARAMI",
                "direction": "PUT",
                "strength": 82,
                "confirmed": True,
                "can_trade": True
            }

        if self.tweezer_bottom(candles):

            return {
                "pattern": "TWEEZER_BOTTOM",
                "direction": "CALL",
                "strength": 82,
                "confirmed": True,
                "can_trade": True
            }

        if self.tweezer_top(candles):

            return {
                "pattern": "TWEEZER_TOP",
                "direction": "PUT",
                "strength": 82,
                "confirmed": True,
                "can_trade": True
            }

        # ======================================================
        # ONE-CANDLE BULLISH PATTERNS
        # ======================================================

        if self.hammer(candles):

            return {
                "pattern": "HAMMER",
                "direction": "CALL",
                "strength": 85,
                "confirmed": True,
                "can_trade": True
            }

        if self.inverted_hammer(candles):

            return {
                "pattern": "INVERTED_HAMMER",
                "direction": "CALL",
                "strength": 82,
                "confirmed": True,
                "can_trade": True
            }

        # ======================================================
        # ONE-CANDLE BEARISH PATTERNS
        # ======================================================

        if self.shooting_star(candles):

            return {
                "pattern": "SHOOTING_STAR",
                "direction": "PUT",
                "strength": 85,
                "confirmed": True,
                "can_trade": True
            }

        if self.hanging_man(candles):

            return {
                "pattern": "HANGING_MAN",
                "direction": "PUT",
                "strength": 80,
                "confirmed": True,
                "can_trade": True
            }

        # ======================================================
        # SPECIAL CANDLE PATTERNS
        # ======================================================

        if self.dragonfly_doji(candles):

            return {
                "pattern": "DRAGONFLY_DOJI",
                "direction": "CALL",
                "strength": 70,
                "confirmed": True,
                "can_trade": True
            }

        if self.gravestone_doji(candles):

            return {
                "pattern": "GRAVESTONE_DOJI",
                "direction": "PUT",
                "strength": 70,
                "confirmed": True,
                "can_trade": True
            }

        if self.marubozu(candles):

            candle = candles[-1]

            if candle.close > candle.open:
                return {
                    "pattern": "BULLISH_MARUBOZU",
                    "direction": "CALL",
                    "strength": 80,
                    "confirmed": True,
                    "can_trade": True
                }

            return {
                "pattern": "BEARISH_MARUBOZU",
                "direction": "PUT",
                "strength": 80,
                "confirmed": True,
                "can_trade": True
            }

        # ======================================================
        # NEUTRAL PATTERNS
        # ======================================================

        if self.doji(candles):

            return {
                "pattern": "DOJI",
                "direction": "WAIT",
                "strength": 50,
                "confirmed": True,
                "can_trade": False
            }

        if self.spinning_top(candles):

            return {
                "pattern": "SPINNING_TOP",
                "direction": "WAIT",
                "strength": 45,
                "confirmed": True,
                "can_trade": False
            }

        return result

    # ==========================================================
    # Helpers
    # ==========================================================

    def body(self, candle):

        return abs(candle.close - candle.open)

    def upper_shadow(self, candle):

        return candle.high - max(
            candle.open,
            candle.close
        )

    def lower_shadow(self, candle):

        return min(
            candle.open,
            candle.close
        ) - candle.low

    def bullish(self, candle):

        return candle.close > candle.open

    def bearish(self, candle):

        return candle.close < candle.open

    # ==========================================================
    # BULLISH ENGULFING
    # ==========================================================

    def bullish_engulfing(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        return (
            self.bearish(previous)
            and self.bullish(current)
            and current.open <= previous.close
            and current.close >= previous.open
        )

    # ==========================================================
    # BEARISH ENGULFING
    # ==========================================================

    def bearish_engulfing(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        return (
            self.bullish(previous)
            and self.bearish(current)
            and current.open >= previous.close
            and current.close <= previous.open
        )

    # ==========================================================
    # HAMMER
    # ==========================================================

    def hammer(self, candles):

        candle = candles[-1]

        body = self.body(candle)

        if body == 0:
            body = 0.0000001

        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            lower >= body * 2
            and upper <= body
            and candle.close > candle.open
        )

    # ==========================================================
    # INVERTED HAMMER
    # ==========================================================

    def inverted_hammer(self, candles):

        candle = candles[-1]

        body = self.body(candle)

        if body == 0:
            body = 0.0000001

        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            upper >= body * 2
            and lower <= body
            and candle.close >= candle.open
        )

    # ==========================================================
    # SHOOTING STAR
    # ==========================================================

    def shooting_star(self, candles):

        candle = candles[-1]

        body = self.body(candle)

        if body == 0:
            body = 0.0000001

        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            upper >= body * 2
            and lower <= body
            and candle.close <= candle.open
        )

    # ==========================================================
    # HANGING MAN
    # ==========================================================

    def hanging_man(self, candles):

        candle = candles[-1]

        body = self.body(candle)

        if body == 0:
            body = 0.0000001

        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            lower >= body * 2
            and upper <= body
            and candle.close <= candle.open
        )

    # ==========================================================
    # PIERCING LINE
    # ==========================================================

    def piercing_line(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        if not self.bearish(previous):
            return False

        if not self.bullish(current):
            return False

        midpoint = (
            previous.open +
            previous.close
        ) / 2

        return (
            current.open <= previous.close
            and current.close > midpoint
            and current.close < previous.open
        )

    # ==========================================================
    # DARK CLOUD COVER
    # ==========================================================

    def dark_cloud_cover(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        if not self.bullish(previous):
            return False

        if not self.bearish(current):
            return False

        midpoint = (
            previous.open +
            previous.close
        ) / 2

        return (
            current.open >= previous.close
            and current.close < midpoint
            and current.close > previous.open
        )

    # ==========================================================
    # BULLISH HARAMI
    # ==========================================================

    def bullish_harami(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        if not self.bearish(previous):
            return False

        if not self.bullish(current):
            return False

        previous_high_body = max(
            previous.open,
            previous.close
        )

        previous_low_body = min(
            previous.open,
            previous.close
        )

        current_high_body = max(
            current.open,
            current.close
        )

        current_low_body = min(
            current.open,
            current.close
        )

        return (
            current_high_body <= previous_high_body
            and current_low_body >= previous_low_body
        )

    # ==========================================================
    # BEARISH HARAMI
    # ==========================================================

    def bearish_harami(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        if not self.bullish(previous):
            return False

        if not self.bearish(current):
            return False

        previous_high_body = max(
            previous.open,
            previous.close
        )

        previous_low_body = min(
            previous.open,
            previous.close
        )

        current_high_body = max(
            current.open,
            current.close
        )

        current_low_body = min(
            current.open,
            current.close
        )

        return (
            current_high_body <= previous_high_body
            and current_low_body >= previous_low_body
        )

    # ==========================================================
    # TWEEZER BOTTOM
    # ==========================================================

    def tweezer_bottom(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        tolerance = max(
            abs(previous.low) * 0.0001,
            0.0000001
        )

        return (
            self.bearish(previous)
            and self.bullish(current)
            and abs(previous.low - current.low) <= tolerance
        )

    # ==========================================================
    # TWEEZER TOP
    # ==========================================================

    def tweezer_top(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        tolerance = max(
            abs(previous.high) * 0.0001,
            0.0000001
        )

        return (
            self.bullish(previous)
            and self.bearish(current)
            and abs(previous.high - current.high) <= tolerance
        )

    # ==========================================================
    # MORNING STAR
    # ==========================================================

    def morning_star(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        first_body = self.body(first)
        second_body = self.body(second)

        if first_body == 0:
            return False

        return (
            self.bearish(first)
            and second_body <= first_body * 0.5
            and self.bullish(third)
            and third.close >
            (first.open + first.close) / 2
        )

    # ==========================================================
    # EVENING STAR
    # ==========================================================

    def evening_star(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        first_body = self.body(first)
        second_body = self.body(second)

        if first_body == 0:
            return False

        return (
            self.bullish(first)
            and second_body <= first_body * 0.5
            and self.bearish(third)
            and third.close <
            (first.open + first.close) / 2
        )

    # ==========================================================
    # THREE WHITE SOLDIERS
    # ==========================================================

    def three_white_soldiers(self, candles):

        if len(candles) < 3:
            return False

        a = candles[-3]
        b = candles[-2]
        c = candles[-1]

        return (
            self.bullish(a)
            and self.bullish(b)
            and self.bullish(c)
            and b.close > a.close
            and c.close > b.close
            and b.open >= a.open
            and c.open >= b.open
        )

    # ==========================================================
    # THREE BLACK CROWS
    # ==========================================================

    def three_black_crows(self, candles):

        if len(candles) < 3:
            return False

        a = candles[-3]
        b = candles[-2]
        c = candles[-1]

        return (
            self.bearish(a)
            and self.bearish(b)
            and self.bearish(c)
            and b.close < a.close
            and c.close < b.close
            and b.open <= a.open
            and c.open <= b.open
        )

    # ==========================================================
    # THREE INSIDE UP
    # ==========================================================

    def three_inside_up(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        first_high = max(first.open, first.close)
        first_low = min(first.open, first.close)

        second_high = max(second.open, second.close)
        second_low = min(second.open, second.close)

        return (
            self.bearish(first)
            and self.bullish(second)
            and second_high <= first_high
            and second_low >= first_low
            and self.bullish(third)
            and third.close > first.open
        )

    # ==========================================================
    # THREE INSIDE DOWN
    # ==========================================================

    def three_inside_down(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        first_high = max(first.open, first.close)
        first_low = min(first.open, first.close)

        second_high = max(second.open, second.close)
        second_low = min(second.open, second.close)

        return (
            self.bullish(first)
            and self.bearish(second)
            and second_high <= first_high
            and second_low >= first_low
            and self.bearish(third)
            and third.close < first.open
        )

    # ==========================================================
    # THREE OUTSIDE UP
    # ==========================================================

    def three_outside_up(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        return (
            self.bearish(first)
            and self.bullish(second)
            and second.open <= first.close
            and second.close >= first.open
            and self.bullish(third)
            and third.close > second.close
        )

    # ==========================================================
    # THREE OUTSIDE DOWN
    # ==========================================================

    def three_outside_down(self, candles):

        if len(candles) < 3:
            return False

        first = candles[-3]
        second = candles[-2]
        third = candles[-1]

        return (
            self.bullish(first)
            and self.bearish(second)
            and second.open >= first.close
            and second.close <= first.open
            and self.bearish(third)
            and third.close < second.close
        )

    # ==========================================================
    # DOJI
    # ==========================================================

    def doji(self, candles):

        candle = candles[-1]

        total_range = candle.high - candle.low

        if total_range <= 0:
            return False

        body = self.body(candle)

        return body <= total_range * 0.10

    # ==========================================================
    # SPINNING TOP
    # ==========================================================

    def spinning_top(self, candles):

        candle = candles[-1]

        total_range = candle.high - candle.low

        if total_range <= 0:
            return False

        body = self.body(candle)
        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            body <= total_range * 0.35
            and upper >= body
            and lower >= body
        )

    # ==========================================================
    # DRAGONFLY DOJI
    # ==========================================================

    def dragonfly_doji(self, candles):

        candle = candles[-1]

        total_range = candle.high - candle.low

        if total_range <= 0:
            return False

        body = self.body(candle)
        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            body <= total_range * 0.10
            and lower >= total_range * 0.60
            and upper <= total_range * 0.10
        )

    # ==========================================================
    # GRAVESTONE DOJI
    # ==========================================================

    def gravestone_doji(self, candles):

        candle = candles[-1]

        total_range = candle.high - candle.low

        if total_range <= 0:
            return False

        body = self.body(candle)
        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            body <= total_range * 0.10
            and upper >= total_range * 0.60
            and lower <= total_range * 0.10
        )

    # ==========================================================
    # MARUBOZU
    # ==========================================================

    def marubozu(self, candles):

        candle = candles[-1]

        total_range = candle.high - candle.low

        if total_range <= 0:
            return False

        body = self.body(candle)
        upper = self.upper_shadow(candle)
        lower = self.lower_shadow(candle)

        return (
            body >= total_range * 0.80
            and upper <= total_range * 0.10
            and lower <= total_range * 0.10
        )