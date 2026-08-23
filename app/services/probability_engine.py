from app.storage.learning_storage import LearningStorage
from app.services.session_ranking import SessionRanking
from app.services.asset_ranking import AssetRanking
from app.services.asset_learning import AssetLearning
from app.services.pattern_learning import PatternLearning


class ProbabilityEngine:

    def __init__(self):
        self.learning = LearningStorage()
        self.sessions = SessionRanking()
        self.assets = AssetRanking()
        self.asset_learning = AssetLearning()
        self.pattern_learning = PatternLearning()

    # ========================================
    # Safe Row Access
    # ========================================

    def _get(self, row, key, default=0):

        if row is None:
            return default

        if hasattr(row, "get"):
            return row.get(key, default)

        try:
            return row[key]
        except (KeyError, IndexError, TypeError):
            return default

    # ========================================
    # Safe Win Rate
    # ========================================

    def _win_rate(self, row):

        if not row:
            return None

        total = self._get(row, "total", 0) or 0
        wins = self._get(row, "wins", 0) or 0

        if total <= 0:
            return None

        return (wins / total) * 100

    # ========================================
    # Calculate Probability
    # ========================================

    def calculate(self, signal, indicator_mode):

        print("----------------------------------------")
        print("PROBABILITY ENGINE")
        print("----------------------------------------")

        # ========================================
        # CURRENT MARKET EVIDENCE
        # ========================================

        probability = 50.0

        agreement = float(getattr(signal, "agreement_score", 0) or 0)

        confirmation_count = int(getattr(signal, "confirmation_count", 0) or 0)

        confirmation_total = int(getattr(signal, "confirmation_total", 0) or 0)

        candle_confirmed = bool(getattr(signal, "candle_confirmed", False))

        candle_strength = float(getattr(signal, "candle_strength", 0) or 0)

        trend = str(getattr(signal, "trend", "") or "").upper()

        bias = str(getattr(signal, "bias", "") or "").upper()

        risk = str(getattr(signal, "risk", "") or "").upper()

        # ========================================
        # AGREEMENT
        # ========================================

        if agreement >= 90:
            probability += 15

        elif agreement >= 80:
            probability += 12

        elif agreement >= 70:
            probability += 8

        elif agreement >= 60:
            probability += 4

        else:
            probability -= 5

        # ========================================
        # CONFIRMATIONS
        # ========================================

        if confirmation_total > 0:

            confirmation_ratio = (confirmation_count / confirmation_total) * 100

            if confirmation_ratio >= 75:
                probability += 12

            elif confirmation_ratio >= 65:
                probability += 9

            elif confirmation_ratio >= 55:
                probability += 6

            elif confirmation_ratio >= 45:
                probability += 2

            else:
                probability -= 5

        # ========================================
        # CANDLE CONFIRMATION
        # ========================================

        if candle_confirmed:
            probability += 8

        # ========================================
        # CANDLE STRENGTH
        # ========================================

        if candle_strength >= 90:
            probability += 8

        elif candle_strength >= 75:
            probability += 6

        elif candle_strength >= 60:
            probability += 4

        elif 0 < candle_strength < 40:
            probability -= 3

        # ========================================
        # TREND / BIAS ALIGNMENT
        # ========================================

        bullish_alignment = bias == "CALL" and trend == "BULLISH"

        bearish_alignment = bias == "PUT" and trend == "BEARISH"

        if bullish_alignment or bearish_alignment:
            probability += 7

        elif bias in ("CALL", "PUT") and trend not in (
            "",
            "UNKNOWN",
            "NEUTRAL",
        ):
            probability -= 3

        # ========================================
        # SIGNAL CONFIRMATION FLAGS
        # ========================================

        confirmation_flags = [
            "ema_confirmed",
            "macd_confirmed",
            "rsi_confirmed",
            "structure_confirmed",
            "zone_confirmed",
            "adx_confirmed",
            "atr_confirmed",
            "candle_confirmed",
            "pullback_confirmed",
        ]

        confirmed_flags = 0

        for name in confirmation_flags:

            if bool(getattr(signal, name, False)):
                confirmed_flags += 1

        if confirmed_flags >= 7:
            probability += 10

        elif confirmed_flags >= 6:
            probability += 8

        elif confirmed_flags >= 5:
            probability += 6

        elif confirmed_flags >= 4:
            probability += 3

        elif confirmed_flags <= 2:
            probability -= 5

        # ========================================
        # RISK
        # ========================================

        if risk == "LOW":
            probability += 5

        elif risk == "MEDIUM":
            probability += 1

        elif risk == "HIGH":
            probability -= 8

        elif risk in ("VERY HIGH", "EXTREME"):
            probability -= 15

        # ========================================
        # CURRENT MARKET EVIDENCE CLAMP
        # ========================================

        probability = max(
            0,
            min(probability, 100),
        )

        print(
            "Current Market Probability :",
            round(probability, 2),
        )

        # ========================================
        # HISTORICAL LEARNING
        #
        # Historical performance is only a
        # small adjustment to current evidence.
        # ========================================

        historical_adjustment = 0.0

        # ========================================
        # Asset History
        # ========================================

        asset = self.learning.asset_stats(signal.asset)

        if asset and (self._get(asset, "total", 0) or 0) >= 10:

            asset_rate = self._win_rate(asset)

            if asset_rate is not None:

                print(
                    "Asset Win Rate :",
                    round(asset_rate, 2),
                )

                if asset_rate >= 70:
                    historical_adjustment += 4

                elif asset_rate >= 60:
                    historical_adjustment += 2

                elif asset_rate <= 40:
                    historical_adjustment -= 4

                elif asset_rate <= 50:
                    historical_adjustment -= 2

        # ========================================
        # Regime History
        # ========================================

        regime = self.learning.regime_stats(signal.regime)

        if regime and (self._get(regime, "total", 0) or 0) >= 10:

            regime_rate = self._win_rate(regime)

            if regime_rate is not None:

                print(
                    "Regime Win Rate :",
                    round(regime_rate, 2),
                )

                if regime_rate >= 70:
                    historical_adjustment += 3

                elif regime_rate >= 60:
                    historical_adjustment += 1

                elif regime_rate <= 40:
                    historical_adjustment -= 3

                elif regime_rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Session Statistics
        # ========================================

        session = self.learning.session_stats(signal.session)

        if session and (self._get(session, "total", 0) or 0) >= 10:

            session_rate = self._win_rate(session)

            if session_rate is not None:

                print(
                    "Session Win Rate :",
                    round(session_rate, 2),
                )

                if session_rate >= 70:
                    historical_adjustment += 2

                elif session_rate >= 60:
                    historical_adjustment += 1

                elif session_rate <= 40:
                    historical_adjustment -= 2

                elif session_rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Indicator Mode
        # ========================================

        mode = self.learning.mode_stats(indicator_mode)

        if mode and (self._get(mode, "total", 0) or 0) >= 10:

            mode_rate = self._win_rate(mode)

            if mode_rate is not None:

                print(
                    "Mode Win Rate :",
                    round(mode_rate, 2),
                )

                if mode_rate >= 70:
                    historical_adjustment += 2

                elif mode_rate >= 60:
                    historical_adjustment += 1

                elif mode_rate <= 40:
                    historical_adjustment -= 2

                elif mode_rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Overall Performance
        # ========================================

        overall = self.learning.overall_stats()

        if overall and (self._get(overall, "total", 0) or 0) >= 50:

            overall_rate = self._win_rate(overall)

            if overall_rate is not None:

                print(
                    "Overall Win Rate :",
                    round(overall_rate, 2),
                )

                if overall_rate >= 70:
                    historical_adjustment += 2

                elif overall_rate >= 60:
                    historical_adjustment += 1

                elif overall_rate <= 40:
                    historical_adjustment -= 2

                elif overall_rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Recent Performance
        # ========================================

        recent = self.learning.recent_stats(50)

        if recent and (self._get(recent, "total", 0) or 0) >= 20:

            recent_rate = self._win_rate(recent)

            if recent_rate is not None:

                print(
                    "Recent Win Rate :",
                    round(recent_rate, 2),
                )

                if recent_rate >= 70:
                    historical_adjustment += 3

                elif recent_rate >= 60:
                    historical_adjustment += 1

                elif recent_rate <= 40:
                    historical_adjustment -= 3

                elif recent_rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Session Ranking
        # ========================================

        session_rankings = self.sessions.rank()

        current_session = None

        for item in session_rankings:

            if (
                self._get(
                    item,
                    "session",
                    None,
                )
                == signal.session
            ):

                current_session = item
                break

        if current_session:

            trades = self._get(
                current_session,
                "trades",
                0,
            )

            rate = self._get(
                current_session,
                "win_rate",
                0,
            )

            if trades >= 20:

                print("----------------------------------------")
                print("Session Ranking")
                print("----------------------------------------")
                print(
                    "Session :",
                    self._get(
                        current_session,
                        "session",
                        signal.session,
                    ),
                )
                print("Trades  :", trades)
                print("Win Rate:", rate)

                if rate >= 70:
                    historical_adjustment += 3

                elif rate >= 60:
                    historical_adjustment += 1

                elif rate <= 40:
                    historical_adjustment -= 3

                elif rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Asset Learning
        # ========================================

        learning = self.asset_learning.evaluate(
            signal,
            indicator_mode,
        )

        if learning:

            rate = (
                self._get(
                    learning,
                    "win_rate",
                    0,
                )
                or 0
            )

            print("----------------------------------------")
            print("Asset Learning")
            print("----------------------------------------")
            print(
                "Asset   :",
                self._get(learning, "asset"),
            )
            print(
                "Session :",
                self._get(learning, "session"),
            )
            print(
                "Regime  :",
                self._get(learning, "regime"),
            )
            print(
                "Mode    :",
                self._get(learning, "mode"),
            )
            print("Win Rate:", rate)

            if rate >= 80:
                historical_adjustment += 3

            elif rate >= 70:
                historical_adjustment += 2

            elif rate <= 40:
                historical_adjustment -= 3

            elif rate <= 50:
                historical_adjustment -= 1

        # ========================================
        # Asset Ranking
        # ========================================

        asset_rankings = self.assets.rank()

        current_asset = None

        for item in asset_rankings:

            if (
                self._get(
                    item,
                    "asset",
                    None,
                )
                == signal.asset
            ):

                current_asset = item
                break

        if current_asset:

            trades = self._get(
                current_asset,
                "trades",
                0,
            )

            rate = (
                self._get(
                    current_asset,
                    "win_rate",
                    0,
                )
                or 0
            )

            if trades >= 20:

                print("----------------------------------------")
                print("Asset Ranking")
                print("----------------------------------------")
                print(
                    "Asset    :",
                    self._get(
                        current_asset,
                        "asset",
                        signal.asset,
                    ),
                )
                print("Trades   :", trades)
                print("Win Rate :", rate)

                if rate >= 75:
                    historical_adjustment += 3

                elif rate >= 65:
                    historical_adjustment += 1

                elif rate <= 40:
                    historical_adjustment -= 3

                elif rate <= 50:
                    historical_adjustment -= 1

        # ========================================
        # Pattern Learning
        # ========================================

        pattern = self.pattern_learning.statistics(signal)

        if pattern:

            pattern_name = self._get(
                pattern,
                "pattern",
                "UNKNOWN",
            )

            total = (
                self._get(
                    pattern,
                    "total",
                    0,
                )
                or 0
            )

            rate = (
                self._get(
                    pattern,
                    "win_rate",
                    0,
                )
                or 0
            )

            print("----------------------------------------")
            print("Pattern Learning")
            print("----------------------------------------")
            print("Pattern :", pattern_name)
            print("Trades  :", total)
            print("Win Rate:", rate)
            print("----------------------------------------")

            if total >= 10:

                if rate >= 80:
                    historical_adjustment += 4

                elif rate >= 70:
                    historical_adjustment += 2

                elif rate >= 60:
                    historical_adjustment += 1

                elif rate <= 40:
                    historical_adjustment -= 4

                elif rate <= 50:
                    historical_adjustment -= 2

        # ========================================
        # Limit Historical Influence
        # ========================================

        historical_adjustment = max(
            -15,
            min(historical_adjustment, 15),
        )

        print(
            "Historical Adjustment :",
            round(historical_adjustment, 2),
        )

        # ========================================
        # Final Probability
        # ========================================

        probability += historical_adjustment

        probability = max(
            0,
            min(probability, 100),
        )

        probability = round(
            probability,
            2,
        )

        print("----------------------------------------")
        print(
            "Final Probability :",
            probability,
        )
        print("----------------------------------------")

        return probability
