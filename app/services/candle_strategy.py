class CandleStrategy:

    def analyze(self, candles):

        result = {
            "pattern": "NONE",
            "direction": "WAIT",
            "strength": 0,
            "confirmed": False,
            "can_trade": False
        }

        if len(candles) < 3:
            return result

        # ------------------------------------
        # Bullish Engulfing
        # ------------------------------------

        if self.bullish_engulfing(candles):

            result.update({
                "pattern": "BULLISH_ENGULFING",
                "direction": "CALL",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            })

            return result

        # ------------------------------------
        # Bearish Engulfing
        # ------------------------------------

        if self.bearish_engulfing(candles):

            result.update({
                "pattern": "BEARISH_ENGULFING",
                "direction": "PUT",
                "strength": 90,
                "confirmed": True,
                "can_trade": True
            })

            return result

        # ------------------------------------
        # Hammer
        # ------------------------------------

        if self.hammer(candles):

            result.update({
                "pattern": "HAMMER",
                "direction": "CALL",
                "strength": 85,
                "confirmed": True,
                "can_trade": True
            })

            return result

        # ------------------------------------
        # Shooting Star
        # ------------------------------------

        if self.shooting_star(candles):

            result.update({
                "pattern": "SHOOTING_STAR",
                "direction": "PUT",
                "strength": 85,
                "confirmed": True,
                "can_trade": True
            })

            return result

        # ------------------------------------
        # Morning Star
        # ------------------------------------

        if self.morning_star(candles):

            result.update({
                "pattern": "MORNING_STAR",
                "direction": "CALL",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            })

            return result

        # ------------------------------------
        # Evening Star
        # ------------------------------------

        if self.evening_star(candles):

            result.update({
                "pattern": "EVENING_STAR",
                "direction": "PUT",
                "strength": 95,
                "confirmed": True,
                "can_trade": True
            })

            return result

        return result

       # ==========================================================
       # Pattern Detection
       # ==========================================================

    def bullish_engulfing(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        prev_open = previous.open
        prev_close = previous.close

        curr_open = current.open
        curr_close = current.close

        if prev_close >= prev_open:
            return False

        if curr_close <= curr_open:
            return False

        if curr_open <= prev_close and curr_close >= prev_open:
            return True

        return False

    def bearish_engulfing(self, candles):

        if len(candles) < 2:
            return False

        previous = candles[-2]
        current = candles[-1]

        prev_open = previous.open
        prev_close = previous.close

        curr_open = current.open
        curr_close = current.close

        if prev_close <= prev_open:
            return False

        if curr_close >= curr_open:
             return False

        if curr_open >= prev_close and curr_close <= prev_open:
            return True

        return False

    def hammer(self, candles):

        if len(candles) < 1:
            return False

        candle = candles[-1]

        body = abs(candle.close - candle.open)

        upper_shadow = candle.high - max(candle.open, candle.close)

        lower_shadow = min(candle.open, candle.close) - candle.low

        # Avoid division by zero
        if body == 0:
           body = 0.0000001

        # Hammer:
        # - Long lower wick
        # - Small upper wick
        # - Bullish body preferred

        if (
           lower_shadow >= body * 2
           and upper_shadow <= body
           and candle.close > candle.open
        ):
            return True

        return False

    def shooting_star(self, candles):

        if len(candles) < 1:
            return False

        candle = candles[-1]

        body = abs(candle.close - candle.open)

        upper_shadow = candle.high - max(candle.open, candle.close)

        lower_shadow = min(candle.open, candle.close) - candle.low

        if body == 0:
         body = 0.0000001
  
         if (
            upper_shadow >= body * 2
            and lower_shadow <= body
            and candle.close < candle.open
         ):
            return True

        return False

    def morning_star(self, candles):
             return False

    def evening_star(self, candles):
          return False