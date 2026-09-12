class SignalAgreement:

    def calculate(self, signal, indicators):

        # ========================================
        # Confirmation Weights
        # ========================================

        weights = {
            "ema": 25,
            "structure": 20,
            "pullback": 15,
            "candle": 15,
            "macd": 10,
            "zone": 7,
            "rsi": 5,
            "adx": 2,
            "atr": 1,
        }

        # ========================================
        # Determine Which Confirmations Exist
        # ========================================

        available = {
            "ema": indicators.ema20 is not None,
            "structure": True,
            "pullback": True,
            "candle": True,
            "macd": (
                indicators.macd is not None and indicators.signal_line is not None
            ),
            "zone": True,
            "rsi": indicators.rsi is not None,
            "adx": indicators.adx is not None,
            "atr": indicators.atr is not None,
        }

        # ========================================
        # Confirmation Values
        # ========================================

        confirmed = {
            "ema": signal.ema_confirmed,
            "structure": signal.structure_confirmed,
            "pullback": signal.pullback_confirmed,
            "candle": signal.candle_confirmed,
            "macd": signal.macd_confirmed,
            "zone": signal.zone_confirmed,
            "rsi": signal.rsi_confirmed,
            "adx": signal.adx_confirmed,
            "atr": signal.atr_confirmed,
        }

        # ========================================
        # Calculate Available Weight
        # ========================================

        available_weight = sum(weights[name] for name in weights if available[name])

        # ========================================
        # Calculate Confirmed Weight
        # ========================================

        confirmed_weight = sum(
            weights[name] for name in weights if available[name] and confirmed[name]
        )

        # ========================================
        # Normalize Agreement
        # ========================================

        if available_weight > 0:

            agreement = (confirmed_weight / available_weight) * 100

        else:

            agreement = 0

        agreement = round(agreement, 2)

        # ========================================
        # Confirmation Count
        # ========================================

        confirmation_count = sum(
            1 for name in weights if available[name] and confirmed[name]
        )

        confirmation_total = sum(1 for name in weights if available[name])

        # ========================================
        # Debug
        # ========================================

        print()
        print("========================================")
        print("BINARY SIGNAL AGREEMENT")
        print("========================================")
        print("Confirmed Weight :", confirmed_weight)
        print("Available Weight :", available_weight)
        print("Agreement        :", agreement)
        print("Confirmations    :", f"{confirmation_count}/{confirmation_total}")
        print("========================================")
        print()

        return {
            "agreement": agreement,
            "confirmations": confirmation_count,
            "total": confirmation_total,
        }
