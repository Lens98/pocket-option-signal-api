from app.models.pattern_result import PatternResult


class CandlePatternDetector:

    # ========================================
    # BASIC CANDLE HELPERS
    # ========================================

    @staticmethod
    def _values(candle):
        return (
            float(candle.open),
            float(candle.high),
            float(candle.low),
            float(candle.close),
        )

    @staticmethod
    def _body(candle):
        return abs(float(candle.close) - float(candle.open))

    @staticmethod
    def _range(candle):
        return max(
            float(candle.high) - float(candle.low),
            0.00000001,
        )

    @staticmethod
    def _upper_wick(candle):
        return float(candle.high) - max(float(candle.open), float(candle.close))

    @staticmethod
    def _lower_wick(candle):
        return min(float(candle.open), float(candle.close)) - float(candle.low)

    @staticmethod
    def _bullish(candle):
        return float(candle.close) > float(candle.open)

    @staticmethod
    def _bearish(candle):
        return float(candle.close) < float(candle.open)

    @classmethod
    def _doji(cls, candle, threshold=0.10):
        return cls._body(candle) <= cls._range(candle) * threshold

    @classmethod
    def _small_body(cls, candle):
        return cls._body(candle) <= cls._range(candle) * 0.35

    @classmethod
    def _long_body(cls, candle):
        return cls._body(candle) >= cls._range(candle) * 0.60

    # ========================================
    # RESULT HELPERS
    # ========================================

    @staticmethod
    def _bullish_result(name, strength):
        return PatternResult(
            found=True,
            name=name,
            bullish=True,
            bearish=False,
            strength=strength,
        )

    @staticmethod
    def _bearish_result(name, strength):
        return PatternResult(
            found=True,
            name=name,
            bullish=False,
            bearish=True,
            strength=strength,
        )

    @staticmethod
    def _neutral_result(name, strength):
        return PatternResult(
            found=True,
            name=name,
            bullish=False,
            bearish=False,
            strength=strength,
        )

    # ========================================
    # SINGLE-CANDLE PATTERNS
    # ========================================

    def hammer(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if (
            body > 0
            and lower >= body * 2
            and upper <= body
            and body / self._range(c) <= 0.45
        ):
            return self._bullish_result(
                "Hammer",
                8,
            )

        return None

    def inverted_hammer(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if (
            body > 0
            and upper >= body * 2
            and lower <= body
            and body / self._range(c) <= 0.45
        ):
            return self._bullish_result(
                "Inverted Hammer",
                7,
            )

        return None

    def hanging_man(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if (
            body > 0
            and lower >= body * 2
            and upper <= body
            and body / self._range(c) <= 0.45
        ):
            return self._bearish_result(
                "Hanging Man",
                7,
            )

        return None

    def shooting_star(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if (
            body > 0
            and upper >= body * 2
            and lower <= body
            and body / self._range(c) <= 0.45
        ):
            return self._bearish_result(
                "Shooting Star",
                8,
            )

        return None

    def dragonfly_doji(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._doji(c):
            return None

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if lower > max(upper * 2, body * 2):
            return self._bullish_result(
                "Dragonfly Doji",
                6,
            )

        return None

    def gravestone_doji(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._doji(c):
            return None

        body = self._body(c)
        lower = self._lower_wick(c)
        upper = self._upper_wick(c)

        if upper > max(lower * 2, body * 2):
            return self._bearish_result(
                "Gravestone Doji",
                6,
            )

        return None

    def doji(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if self._doji(c):
            return self._neutral_result(
                "Doji",
                5,
            )

        return None

    def long_legged_doji(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._doji(c):
            return None

        upper = self._upper_wick(c)
        lower = self._lower_wick(c)

        if upper >= self._range(c) * 0.30 and lower >= self._range(c) * 0.30:
            return self._neutral_result(
                "Long-Legged Doji",
                5,
            )

        return None

    def spinning_top(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._small_body(c):
            return None

        upper = self._upper_wick(c)
        lower = self._lower_wick(c)

        if upper >= self._body(c) and lower >= self._body(c):
            return self._neutral_result(
                "Spinning Top",
                4,
            )

        return None

    def high_wave(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._small_body(c):
            return None

        if (
            self._upper_wick(c) >= self._range(c) * 0.35
            and self._lower_wick(c) >= self._range(c) * 0.35
        ):
            return self._neutral_result(
                "High-Wave Candle",
                4,
            )

        return None

    def marubozu(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if not self._long_body(c):
            return None

        upper = self._upper_wick(c)
        lower = self._lower_wick(c)

        if upper <= self._range(c) * 0.10 and lower <= self._range(c) * 0.10:
            if self._bullish(c):
                return self._bullish_result(
                    "Bullish Marubozu",
                    8,
                )

            if self._bearish(c):
                return self._bearish_result(
                    "Bearish Marubozu",
                    8,
                )

        return None

    # ========================================
    # TWO-CANDLE PATTERNS
    # ========================================

    def bullish_engulfing(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bearish(previous) and self._bullish(current)):
            return None

        if float(current.open) <= float(previous.close) and float(
            current.close
        ) >= float(previous.open):
            return self._bullish_result(
                "Bullish Engulfing",
                10,
            )

        return None

    def bearish_engulfing(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bullish(previous) and self._bearish(current)):
            return None

        if float(current.open) >= float(previous.close) and float(
            current.close
        ) <= float(previous.open):
            return self._bearish_result(
                "Bearish Engulfing",
                10,
            )

        return None

    def bullish_harami(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bearish(previous) and self._small_body(current)):
            return None

        if float(current.open) > float(previous.close) and float(current.close) < float(
            previous.open
        ):
            return self._bullish_result(
                "Bullish Harami",
                7,
            )

        return None

    def bearish_harami(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bullish(previous) and self._small_body(current)):
            return None

        if float(current.open) < float(previous.close) and float(current.close) > float(
            previous.open
        ):
            return self._bearish_result(
                "Bearish Harami",
                7,
            )

        return None

    def piercing_line(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bearish(previous) and self._bullish(current)):
            return None

        midpoint = (float(previous.open) + float(previous.close)) / 2

        if (
            float(current.open) < float(previous.close)
            and float(current.close) > midpoint
            and float(current.close) < float(previous.open)
        ):
            return self._bullish_result(
                "Piercing Line",
                8,
            )

        return None

    def dark_cloud_cover(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if not (self._bullish(previous) and self._bearish(current)):
            return None

        midpoint = (float(previous.open) + float(previous.close)) / 2

        if (
            float(current.open) > float(previous.close)
            and float(current.close) < midpoint
            and float(current.close) > float(previous.open)
        ):
            return self._bearish_result(
                "Dark Cloud Cover",
                8,
            )

        return None

    def tweezer_bottom(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if (
            self._bearish(previous)
            and self._bullish(current)
            and abs(float(previous.low) - float(current.low))
            <= self._range(current) * 0.10
        ):
            return self._bullish_result(
                "Tweezer Bottom",
                7,
            )

        return None

    def tweezer_top(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if (
            self._bullish(previous)
            and self._bearish(current)
            and abs(float(previous.high) - float(current.high))
            <= self._range(current) * 0.10
        ):
            return self._bearish_result(
                "Tweezer Top",
                7,
            )

        return None

    def bullish_kicker(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if (
            self._bearish(previous)
            and self._bullish(current)
            and float(current.open) > float(previous.open)
        ):
            return self._bullish_result(
                "Bullish Kicker",
                9,
            )

        return None

    def bearish_kicker(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if (
            self._bullish(previous)
            and self._bearish(current)
            and float(current.open) < float(previous.open)
        ):
            return self._bearish_result(
                "Bearish Kicker",
                9,
            )

        return None

    # ========================================
    # THREE-CANDLE PATTERNS
    # ========================================

    def morning_star(self, candles):

        if len(candles) < 3:
            return None

        first = candles[-3]
        middle = candles[-2]
        last = candles[-1]

        if not self._bearish(first):
            return None

        if not self._small_body(middle):
            return None

        midpoint = (float(first.open) + float(first.close)) / 2

        if self._bullish(last) and float(last.close) > midpoint:
            return self._bullish_result(
                "Morning Star",
                10,
            )

        return None

    def evening_star(self, candles):

        if len(candles) < 3:
            return None

        first = candles[-3]
        middle = candles[-2]
        last = candles[-1]

        if not self._bullish(first):
            return None

        if not self._small_body(middle):
            return None

        midpoint = (float(first.open) + float(first.close)) / 2

        if self._bearish(last) and float(last.close) < midpoint:
            return self._bearish_result(
                "Evening Star",
                10,
            )

        return None

    def three_white_soldiers(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if not (self._bullish(a) and self._bullish(b) and self._bullish(c)):
            return None

        if not (self._long_body(a) and self._long_body(b) and self._long_body(c)):
            return None

        if not (float(b.close) > float(a.close) and float(c.close) > float(b.close)):
            return None

        return self._bullish_result(
            "Three White Soldiers",
            10,
        )

    def three_black_crows(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if not (self._bearish(a) and self._bearish(b) and self._bearish(c)):
            return None

        if not (self._long_body(a) and self._long_body(b) and self._long_body(c)):
            return None

        if not (float(b.close) < float(a.close) and float(c.close) < float(b.close)):
            return None

        return self._bearish_result(
            "Three Black Crows",
            10,
        )

    def rising_three_methods(self, candles):

        if len(candles) < 5:
            return None

        first = candles[-5]
        middle = candles[-4:-1]
        last = candles[-1]

        if not (
            self._bullish(first)
            and self._bullish(last)
            and self._long_body(first)
            and self._long_body(last)
        ):
            return None

        inside = all(
            float(c.high) < float(first.high) and float(c.low) > float(first.low)
            for c in middle
        )

        if inside and float(last.close) > float(first.close):
            return self._bullish_result(
                "Rising Three Methods",
                9,
            )

        return None

    def falling_three_methods(self, candles):

        if len(candles) < 5:
            return None

        first = candles[-5]
        middle = candles[-4:-1]
        last = candles[-1]

        if not (
            self._bearish(first)
            and self._bearish(last)
            and self._long_body(first)
            and self._long_body(last)
        ):
            return None

        inside = all(
            float(c.high) < float(first.high) and float(c.low) > float(first.low)
            for c in middle
        )

        if inside and float(last.close) < float(first.close):
            return self._bearish_result(
                "Falling Three Methods",
                9,
            )

        return None

    def three_inside_up(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if not (self._bearish(a) and self._small_body(b) and self._bullish(c)):
            return None

        if (
            float(b.high) < float(a.open)
            and float(b.low) > float(a.close)
            and float(c.close) > float(a.open)
        ):
            return self._bullish_result(
                "Three Inside Up",
                9,
            )

        return None

    def three_inside_down(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if not (self._bullish(a) and self._small_body(b) and self._bearish(c)):
            return None

        if (
            float(b.high) < float(a.close)
            and float(b.low) > float(a.open)
            and float(c.close) < float(a.open)
        ):
            return self._bearish_result(
                "Three Inside Down",
                9,
            )

        return None

    # ========================================
    # ABANDONED BABY
    # ========================================

    def abandoned_baby_bullish(self, candles):

        if len(candles) < 3:
            return None

        first, middle, last = candles[-3:]

        if not self._bearish(first):
            return None

        if not self._doji(middle):
            return None

        if not self._bullish(last):
            return None

        if float(middle.high) < float(first.close) and float(middle.high) < float(
            last.open
        ):
            return self._bullish_result(
                "Abandoned Baby",
                9,
            )

        return None

    def abandoned_baby_bearish(self, candles):

        if len(candles) < 3:
            return None

        first, middle, last = candles[-3:]

        if not self._bullish(first):
            return None

        if not self._doji(middle):
            return None

        if not self._bearish(last):
            return None

        if float(middle.low) > float(first.close) and float(middle.low) > float(
            last.open
        ):
            return self._bearish_result(
                "Abandoned Baby",
                9,
            )

        return None

    # ========================================
    # TRI-STAR
    # ========================================

    def tri_star_bullish(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if (
            self._doji(a)
            and self._doji(b)
            and self._doji(c)
            and float(b.high) < float(a.low)
            and float(c.high) > float(b.high)
        ):
            return self._bullish_result(
                "Tri-Star Bullish",
                8,
            )

        return None

    def tri_star_bearish(self, candles):

        if len(candles) < 3:
            return None

        a, b, c = candles[-3:]

        if (
            self._doji(a)
            and self._doji(b)
            and self._doji(c)
            and float(b.low) > float(a.high)
            and float(c.low) < float(b.low)
        ):
            return self._bearish_result(
                "Tri-Star Bearish",
                8,
            )

        return None

    # ========================================
    # INSIDE BAR
    # ========================================

    def inside_bar(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if float(current.high) <= float(previous.high) and float(current.low) >= float(
            previous.low
        ):
            return self._neutral_result(
                "Inside Bar",
                5,
            )

        return None

    # ========================================
    # OUTSIDE BAR
    # ========================================

    def outside_bar(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if float(current.high) > float(previous.high) and float(current.low) < float(
            previous.low
        ):
            return self._neutral_result(
                "Outside Bar",
                6,
            )

        return None

    # ========================================
    # RICKSHAW MAN
    # ========================================

    def rickshaw_man(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if (
            self._doji(c)
            and self._upper_wick(c) >= self._range(c) * 0.30
            and self._lower_wick(c) >= self._range(c) * 0.30
        ):
            return self._neutral_result(
                "Rickshaw Man",
                4,
            )

        return None

    # ========================================
    # PIVOT CANDLE
    # ========================================

    def pivot_candle(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        body_ratio = self._body(c) / self._range(c)

        if (
            0.25 <= body_ratio <= 0.55
            and self._upper_wick(c) >= self._body(c)
            and self._lower_wick(c) >= self._body(c)
        ):
            return self._neutral_result(
                "Pivot Candle",
                4,
            )

        return None

    # ========================================
    # FOUR PRICE DOJI
    # ========================================

    def four_price_doji(self, candles):

        if len(candles) < 1:
            return None

        c = candles[-1]

        if (
            float(c.open) == float(c.high)
            and float(c.high) == float(c.low)
            and float(c.low) == float(c.close)
        ):
            return self._neutral_result(
                "Four Price Doji",
                3,
            )

        return None

    # ========================================
    # ADJACENT SPINNING TOP
    # ========================================

    def spinning_top_adjacent(self, candles):

        if len(candles) < 2:
            return None

        previous = candles[-2]
        current = candles[-1]

        if self.spinning_top([previous]) and self.spinning_top([current]):
            return self._neutral_result(
                "Spinning Top Adjacent",
                5,
            )

        return None

    # ========================================
    # MAIN DETECTOR
    # ========================================

    def detect(self, candles):

        patterns = []

        if not candles:
            return patterns

        detectors = [
            # Single candle
            self.hammer,
            self.inverted_hammer,
            self.hanging_man,
            self.shooting_star,
            self.dragonfly_doji,
            self.gravestone_doji,
            self.long_legged_doji,
            self.high_wave,
            self.marubozu,
            self.rickshaw_man,
            self.pivot_candle,
            self.four_price_doji,
            # Two candle
            self.bullish_engulfing,
            self.bearish_engulfing,
            self.bullish_harami,
            self.bearish_harami,
            self.piercing_line,
            self.dark_cloud_cover,
            self.tweezer_bottom,
            self.tweezer_top,
            self.bullish_kicker,
            self.bearish_kicker,
            self.inside_bar,
            self.outside_bar,
            # Three candle
            self.morning_star,
            self.evening_star,
            self.three_white_soldiers,
            self.three_black_crows,
            self.three_inside_up,
            self.three_inside_down,
            self.abandoned_baby_bullish,
            self.abandoned_baby_bearish,
            self.tri_star_bullish,
            self.tri_star_bearish,
            # Five candle
            self.rising_three_methods,
            self.falling_three_methods,
            # Other
            self.spinning_top_adjacent,
        ]

        for detector in detectors:

            try:

                result = detector(candles)

                if result is not None and result.found:
                    patterns.append(result)

            except (
                TypeError,
                ValueError,
                AttributeError,
                IndexError,
            ):

                continue

        # ----------------------------------------
        # Generic Doji
        # ----------------------------------------
        #
        # Add generic Doji only when it was not
        # already classified as a stronger Doji.
        #

        if self._doji(candles[-1]):

            names = {pattern.name for pattern in patterns}

            specialized_doji = {
                "Dragonfly Doji",
                "Gravestone Doji",
                "Long-Legged Doji",
                "Rickshaw Man",
                "Four Price Doji",
            }

            if not names.intersection(specialized_doji):

                doji = self.doji(candles)

                if doji is not None:
                    patterns.append(doji)

        # ----------------------------------------
        # Remove duplicate pattern names
        # ----------------------------------------

        unique = []
        seen = set()

        for pattern in patterns:

            if pattern.name in seen:
                continue

            seen.add(pattern.name)
            unique.append(pattern)

        return unique
