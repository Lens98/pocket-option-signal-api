from app.models.market_regime import MarketRegime


class MarketRegimeDetector:

    def detect(self, indicators):

        reasons = []

        # -------------------------
        # Volatility
        # -------------------------

        if indicators.atr is None:

            volatility = "UNKNOWN"

        elif indicators.atr > 0.0010:

            volatility = "HIGH"

        elif indicators.atr > 0.0005:

            volatility = "MEDIUM"

        else:

            volatility = "LOW"

        reasons.append(

            f"ATR Volatility: {volatility}"

        )

        # -------------------------
        # Trend Strength
        # -------------------------

        if indicators.adx is None:

            strength = "UNKNOWN"

        elif indicators.adx >= 30:

            strength = "STRONG"

        elif indicators.adx >= 20:

            strength = "MODERATE"

        else:

            strength = "WEAK"

        reasons.append(

            f"ADX Trend: {strength}"

        )

        # -------------------------
        # Market Regime
        # -------------------------

        if strength == "STRONG":

            regime = "TRENDING"

            confidence = 90

        elif strength == "MODERATE":

            regime = "BREAKOUT"

            confidence = 75

        elif volatility == "LOW":

            regime = "RANGING"

            confidence = 80

        else:

            regime = "REVERSAL"

            confidence = 65

        reasons.append(

            f"Regime: {regime}"

        )

        return MarketRegime(

            regime=regime,

            confidence=confidence,

            volatility=volatility,

            trend_strength=strength,

            reasons=reasons

        )