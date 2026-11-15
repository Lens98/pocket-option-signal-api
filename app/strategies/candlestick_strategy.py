from app.strategies.strategy_result import StrategyResult
from app.indicators.candle_patterns import CandlePatternDetector


class CandlestickStrategy:

    def __init__(self):

        self.detector = CandlePatternDetector()

    # ========================================
    # BASIC CANDLE HELPERS
    # ========================================

    @staticmethod
    def _direction(candle):

        if float(candle.close) > float(candle.open):
            return "BULLISH"

        if float(candle.close) < float(candle.open):
            return "BEARISH"

        return "NEUTRAL"

    # ========================================
    # RECENT TREND
    # ========================================

    @classmethod
    def _recent_trend(cls, candles, lookback=5):

        if len(candles) < 3:
            return "SIDEWAYS"

        recent = candles[-lookback:]

        bullish_count = 0
        bearish_count = 0

        for candle in recent:

            direction = cls._direction(candle)

            if direction == "BULLISH":
                bullish_count += 1

            elif direction == "BEARISH":
                bearish_count += 1

        first_close = float(recent[0].close)
        last_close = float(recent[-1].close)

        price_change = last_close - first_close

        if bullish_count >= 3 and price_change > 0:
            return "BULLISH"

        if bearish_count >= 3 and price_change < 0:
            return "BEARISH"

        return "SIDEWAYS"

    # ========================================
    # CONTEXT
    # ========================================

    @classmethod
    def _context(cls, candles):

        trend = cls._recent_trend(candles)

        if not candles:
            return trend

        current_direction = cls._direction(candles[-1])

        if trend == "BULLISH":

            if current_direction == "BULLISH":
                return "BULLISH_CONTINUATION"

            if current_direction == "BEARISH":
                return "BULLISH_REVERSAL_WARNING"

            return "BULLISH_PAUSE"

        if trend == "BEARISH":

            if current_direction == "BEARISH":
                return "BEARISH_CONTINUATION"

            if current_direction == "BULLISH":
                return "BEARISH_REVERSAL_WARNING"

            return "BEARISH_PAUSE"

        return "SIDEWAYS"

    # ========================================
    # RESOLVE AMBIGUOUS PATTERNS
    # ========================================

    @staticmethod
    def _resolve_pattern(pattern_name, trend):

        name = pattern_name.lower()

        # ------------------------------------
        # Hammer / Hanging Man
        # ------------------------------------

        if name == "hammer":

            if trend == "BEARISH":
                return ("BULLISH", "Hammer confirmed as bullish reversal candidate")

            if trend == "BULLISH":
                return (
                    "BEARISH",
                    "Hammer-shaped candle in uptrend — hanging-man warning",
                )

            return ("NEUTRAL", "Hammer-shaped candle without clear trend")

        # ------------------------------------
        # Hanging Man
        # ------------------------------------

        if name == "hanging man":

            if trend == "BULLISH":
                return ("BEARISH", "Hanging Man confirmed after bullish trend")

            if trend == "BEARISH":
                return (
                    "BULLISH",
                    "Hanging-man shape in downtrend — possible bullish rejection",
                )

            return ("NEUTRAL", "Hanging-man shape without clear trend")

        # ------------------------------------
        # Inverted Hammer / Shooting Star
        # ------------------------------------

        if name == "inverted hammer":

            if trend == "BEARISH":
                return (
                    "BULLISH",
                    "Inverted Hammer confirmed as bullish reversal candidate",
                )

            if trend == "BULLISH":
                return ("BEARISH", "Inverted-hammer shape in uptrend — bearish warning")

            return ("NEUTRAL", "Inverted-hammer shape without clear trend")

        # ------------------------------------
        # Shooting Star
        # ------------------------------------

        if name == "shooting star":

            if trend == "BULLISH":
                return ("BEARISH", "Shooting Star confirmed after bullish trend")

            if trend == "BEARISH":
                return (
                    "BULLISH",
                    "Shooting-star shape in downtrend — bullish rejection candidate",
                )

            return ("NEUTRAL", "Shooting-star shape without clear trend")

        # ------------------------------------
        # Doji
        # ------------------------------------

        if "doji" in name:

            return ("NEUTRAL", "Doji indicates market indecision")

        # ------------------------------------
        # Neutral patterns
        # ------------------------------------

        if name in {
            "inside bar",
            "outside bar",
            "spinning top",
            "spinning top adjacent",
            "rickshaw man",
            "pivot candle",
            "high-wave candle",
            "four price doji",
        }:

            return ("NEUTRAL", f"{pattern_name} requires directional confirmation")

        # ------------------------------------
        # Normal directional patterns
        # ------------------------------------

        if pattern_name:

            if "bullish" in name:
                return ("BULLISH", f"{pattern_name} confirms bullish pressure")

            if "bearish" in name:
                return ("BEARISH", f"{pattern_name} confirms bearish pressure")

        # ------------------------------------
        # Known directional names
        # ------------------------------------

        bullish_patterns = {
            "piercing line",
            "morning star",
            "tweezer bottom",
            "bullish kicker",
            "three white soldiers",
            "rising three methods",
            "three inside up",
        }

        bearish_patterns = {
            "dark cloud cover",
            "evening star",
            "tweezer top",
            "bearish kicker",
            "three black crows",
            "falling three methods",
            "three inside down",
        }

        if name in bullish_patterns:
            return ("BULLISH", f"{pattern_name} confirms bullish pressure")

        if name in bearish_patterns:
            return ("BEARISH", f"{pattern_name} confirms bearish pressure")

        return ("NEUTRAL", f"{pattern_name} requires additional confirmation")
        # ========================================

    # NORMALIZE AMBIGUOUS CANDLE SHAPES
    # ========================================

    @staticmethod
    def _normalize_patterns(patterns, trend):

        names = {pattern.name for pattern in patterns}

        normalized = []

        # ------------------------------------
        # HAMMER SHAPE
        # ------------------------------------
        #
        # The detector can identify the same
        # lower-wick geometry as both:
        #
        # Hammer
        # Hanging Man
        #
        # Context decides which interpretation
        # we use.
        # ------------------------------------

        lower_wick_shape = "Hammer" in names and "Hanging Man" in names

        if lower_wick_shape:

            if trend == "BEARISH":

                selected = next(
                    (pattern for pattern in patterns if pattern.name == "Hammer"),
                    None,
                )

                if selected:
                    normalized.append(selected)

            elif trend == "BULLISH":

                selected = next(
                    (pattern for pattern in patterns if pattern.name == "Hanging Man"),
                    None,
                )

                if selected:
                    normalized.append(selected)

            else:

                # No clear trend.
                # Do not force CALL or PUT.
                pass

        # ------------------------------------
        # INVERTED HAMMER / SHOOTING STAR
        # ------------------------------------

        upper_wick_shape = "Inverted Hammer" in names and "Shooting Star" in names

        if upper_wick_shape:

            if trend == "BEARISH":

                selected = next(
                    (
                        pattern
                        for pattern in patterns
                        if pattern.name == "Inverted Hammer"
                    ),
                    None,
                )

                if selected:
                    normalized.append(selected)

            elif trend == "BULLISH":

                selected = next(
                    (
                        pattern
                        for pattern in patterns
                        if pattern.name == "Shooting Star"
                    ),
                    None,
                )

                if selected:
                    normalized.append(selected)

            else:

                # No clear trend.
                # Do not force CALL or PUT.
                pass

        # ------------------------------------
        # ADD ALL OTHER PATTERNS
        # ------------------------------------

        ambiguous_names = {
            "Hammer",
            "Hanging Man",
            "Inverted Hammer",
            "Shooting Star",
        }

        for pattern in patterns:

            if pattern.name in ambiguous_names:

                continue

            normalized.append(pattern)

        return normalized

    # ========================================
    # SCORE PATTERN
    # ========================================

    def _score_pattern(
        self,
        pattern,
        trend,
        context,
    ):

        strength = max(
            1,
            min(
                int(pattern.strength),
                10,
            ),
        )

        bullish_score = 0
        bearish_score = 0

        reasons = []

        direction, explanation = self._resolve_pattern(
            pattern.name,
            trend,
        )

        reasons.append(f"Pattern: {pattern.name}")

        reasons.append(explanation)

        # ====================================
        # DIRECTIONAL PATTERN
        # ====================================

        if direction == "BULLISH":

            bullish_score += strength

            # --------------------------------
            # Trend agreement
            # --------------------------------

            if trend == "BULLISH":

                bullish_score += 2

                reasons.append("Bullish pattern agrees with bullish trend")

            # --------------------------------
            # Reversal confirmation
            # --------------------------------

            elif trend == "BEARISH":

                bullish_score += 3

                reasons.append("Bullish reversal pattern appears after bearish trend")

        elif direction == "BEARISH":

            bearish_score += strength

            # --------------------------------
            # Trend agreement
            # --------------------------------

            if trend == "BEARISH":

                bearish_score += 2

                reasons.append("Bearish pattern agrees with bearish trend")

            # --------------------------------
            # Reversal confirmation
            # --------------------------------

            elif trend == "BULLISH":

                bearish_score += 3

                reasons.append("Bearish reversal pattern appears after bullish trend")
        # ====================================
        # DOJI / NEUTRAL
        # ====================================

        else:

            if "doji" in pattern.name.lower():

                reasons.append(
                    "Doji indicates indecision — " "directional confirmation required"
                )

            else:

                reasons.append(
                    "Neutral candle pattern — " "directional confirmation required"
                )

        # ====================================
        # RETURN SCORES
        # ====================================

        return (
            bullish_score,
            bearish_score,
            reasons,
        )

    # ========================================
    # MAIN ANALYSIS
    # ========================================

    def analyze(self, market):

        result = StrategyResult()

        candles = market.candles

        if not candles:

            result.reasons.append("No candle history")

            return result

        # ====================================
        # DETECT PATTERNS
        # ====================================

        patterns = self.detector.detect(candles)

        if not patterns:

            result.reasons.append("No Candlestick Pattern")

            return result

        # ====================================
        # MARKET CONTEXT
        # ====================================

        trend = self._recent_trend(candles)

        context = self._context(candles)

        result.reasons.append(f"Candle Trend: {trend}")

        result.reasons.append(f"Candle Context: {context}")

        # ====================================
        # PROCESS PATTERNS
        # ====================================
        # ====================================
        # NORMALIZE PATTERNS
        # ====================================

        patterns = self._normalize_patterns(
            patterns,
            trend,
        )

        result.reasons.append(
            "Patterns After Context: " + ", ".join(pattern.name for pattern in patterns)
        )

        # ====================================
        # PROCESS NORMALIZED PATTERNS
        # ====================================

        strongest = 0

        for pattern in patterns:

            strongest = max(
                strongest,
                int(pattern.strength),
            )

            bullish, bearish, reasons = self._score_pattern(
                pattern,
                trend,
                context,
            )

            result.bullish_score += bullish

            result.bearish_score += bearish

            result.reasons.extend(reasons)

        # ====================================
        # STRONG PATTERN BONUS
        # ====================================

        if strongest >= 8:

            if result.bullish_score > result.bearish_score:

                result.bullish_score += 2

                result.reasons.append("Strong Bullish Candlestick Setup")

            elif result.bearish_score > result.bullish_score:

                result.bearish_score += 2

                result.reasons.append("Strong Bearish Candlestick Setup")

                # ====================================
        # FINAL CANDLE TREND
        # ====================================

        if result.bullish_score > result.bearish_score:

            result.trend = "BULLISH"
            result.next_candle_bias = "CALL"

            result.reasons.append("Candlestick Bias: NEXT-CANDLE CALL candidate")

        elif result.bearish_score > result.bullish_score:

            result.trend = "BEARISH"
            result.next_candle_bias = "PUT"

            result.reasons.append("Candlestick Bias: NEXT-CANDLE PUT candidate")

        else:

            result.trend = "SIDEWAYS"
            result.next_candle_bias = "WAIT"

            result.reasons.append("Candlestick Bias: WAIT")

        # ====================================
        # DEBUG
        # ====================================

        print()
        print("========================================")
        print("CANDLESTICK STRATEGY")
        print("========================================")
        print("Recent Trend :", trend)
        print("Context      :", context)
        print(
            "Patterns     :",
            [pattern.name for pattern in patterns],
        )
        print(
            "Bullish Score:",
            result.bullish_score,
        )
        print(
            "Bearish Score:",
            result.bearish_score,
        )
        print(
            "Final Trend  :",
            result.trend,
        )
        print("========================================")
        print()

        return result
