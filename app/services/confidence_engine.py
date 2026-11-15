class ConfidenceEngine:

    def calculate(
        self,
        signal,
        agreement_score=0,
        market_quality=50,
        learning_score=50,
    ):
        """
        Binary confidence engine.

        Confidence is based on:
        - Technical confirmations
        - Agreement
        - Market quality
        - Probability

        Missing indicators are NOT treated as negative.
        This is important during STARTUP mode.
        """

        # ========================================
        # TECHNICAL CONFIDENCE
        # ========================================

        available = 0
        confirmed = 0

        confirmations = [
            getattr(signal, "ema_confirmed", False),
            getattr(signal, "rsi_confirmed", False),
            getattr(signal, "macd_confirmed", False),
            getattr(signal, "structure_confirmed", False),
            getattr(signal, "zone_confirmed", False),
            getattr(signal, "candle_confirmed", False),
            getattr(signal, "pullback_confirmed", False),
            getattr(signal, "adx_confirmed", False),
            getattr(signal, "atr_confirmed", False),
        ]

        # ----------------------------------------
        # Only count confirmations that are
        # actually available.
        # ----------------------------------------

        confirmation_total = getattr(
            signal,
            "confirmation_total",
            9,
        )

        confirmation_count = getattr(
            signal,
            "confirmation_count",
            0,
        )

        try:
            confirmation_total = int(confirmation_total)
            confirmation_count = int(confirmation_count)
        except (TypeError, ValueError):
            confirmation_total = 9
            confirmation_count = 0

        if confirmation_total > 0:

            confirmation_ratio = confirmation_count / confirmation_total

        else:

            confirmation_ratio = 0.0

        # ========================================
        # Technical Base
        # ========================================

        technical = 50.0

        # Agreement contributes directly.
        technical += agreement_score * 0.20

        # Confirmation ratio contributes directly.
        technical += confirmation_ratio * 20

        # Pullback is particularly important for
        # binary next-candle entries.
        if getattr(
            signal,
            "pullback_confirmed",
            False,
        ):

            technical += 5

        # Strong directional trend.
        if signal.trend in [
            "BULLISH",
            "BEARISH",
        ]:

            technical += 5

        # ========================================
        # Probability
        # ========================================

        try:
            probability = float(learning_score)
        except (TypeError, ValueError):

            probability = 50.0

        probability = max(
            0.0,
            min(probability, 100.0),
        )

        # ========================================
        # Market Quality
        # ========================================

        try:
            quality = float(market_quality)
        except (TypeError, ValueError):

            quality = 50.0

        quality = max(
            0.0,
            min(quality, 100.0),
        )

        # ========================================
        # Binary Confidence
        # ========================================

        final_confidence = (
            technical * 0.50
            + agreement_score * 0.20
            + quality * 0.15
            + probability * 0.15
        )

        # ========================================
        # Clamp
        # ========================================

        final_confidence = max(
            0.0,
            min(final_confidence, 100.0),
        )

        # ========================================
        # Debug
        # ========================================

        print()
        print("========================================")
        print("BINARY CONFIDENCE ENGINE")
        print("========================================")
        print("Technical       :", round(technical, 2))
        print("Agreement       :", agreement_score)
        print("Market Quality  :", quality)
        print("Probability     :", probability)
        print(
            "Confirmations   :",
            f"{confirmation_count}/{confirmation_total}",
        )
        print(
            "Pullback        :",
            getattr(
                signal,
                "pullback_confirmed",
                False,
            ),
        )
        print(
            "Final Confidence:",
            round(
                final_confidence,
                2,
            ),
        )
        print("========================================")
        print()

        return round(
            final_confidence,
            2,
        )
