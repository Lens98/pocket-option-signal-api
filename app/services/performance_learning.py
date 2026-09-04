from app.services.performance_analyzer import PerformanceAnalyzer


class PerformanceLearning:

    # ========================================
    # CONFIGURATION
    # ========================================

    MINIMUM_TRADES = 20
    STRONG_SAMPLE_SIZE = 100

    NEUTRAL_WIN_RATE = 50.0

    MAX_BOOST = 10.0
    MAX_PENALTY = -10.0

    # ========================================
    # INITIALIZE
    # ========================================

    def __init__(self):

        self.analyzer = PerformanceAnalyzer()

    # ========================================
    # CHECK IF SAMPLE IS RELIABLE
    # ========================================

    def is_reliable(self, stats):

        total_trades = stats.get(
            "total_trades",
            0,
        )

        return total_trades >= self.MINIMUM_TRADES

    # ========================================
    # CALCULATE SAMPLE STRENGTH
    # ========================================

    def sample_strength(self, total_trades):

        if total_trades < self.MINIMUM_TRADES:
            return 0.0

        if total_trades >= self.STRONG_SAMPLE_SIZE:
            return 1.0

        return round(
            total_trades / self.STRONG_SAMPLE_SIZE,
            4,
        )

    # ========================================
    # CALCULATE LEARNING ADJUSTMENT
    # ========================================

    def calculate_adjustment(self, stats):

        if not self.is_reliable(stats):

            return {
                "adjustment": 0.0,
                "reason": "INSUFFICIENT_DATA",
                "reliable": False,
            }

        win_rate = stats.get(
            "win_rate",
            self.NEUTRAL_WIN_RATE,
        )

        total_trades = stats.get(
            "total_trades",
            0,
        )

        strength = self.sample_strength(total_trades)

        difference = win_rate - self.NEUTRAL_WIN_RATE

        adjustment = difference * strength

        adjustment = max(
            self.MAX_PENALTY,
            min(
                self.MAX_BOOST,
                adjustment,
            ),
        )

        adjustment = round(
            adjustment,
            2,
        )

        if adjustment > 0:

            reason = "POSITIVE_HISTORICAL_PERFORMANCE"

        elif adjustment < 0:

            reason = "NEGATIVE_HISTORICAL_PERFORMANCE"

        else:

            reason = "NEUTRAL_HISTORICAL_PERFORMANCE"

        return {
            "adjustment": adjustment,
            "reason": reason,
            "reliable": True,
            "win_rate": win_rate,
            "total_trades": total_trades,
            "sample_strength": strength,
        }

    # ========================================
    # FIND CONTEXT STATISTICS
    # ========================================

    def get_context_stats(
        self,
        asset=None,
        action=None,
        session=None,
        regime=None,
        indicator_mode=None,
    ):

        trades = self.analyzer.get_closed_trades()

        matching_trades = []

        for trade in trades:

            if asset is not None and trade["asset"] != asset:
                continue

            if action is not None and trade["action"] != action:
                continue

            if session is not None and trade["session"] != session:
                continue

            if regime is not None and trade["regime"] != regime:
                continue

            if indicator_mode is not None and trade["indicator_mode"] != indicator_mode:
                continue

            matching_trades.append(trade)

        return self.analyzer.calculate_statistics(matching_trades)

    # ========================================
    # LEARN FROM CURRENT CONTEXT
    # ========================================

    def learn_context(
        self,
        asset=None,
        action=None,
        session=None,
        regime=None,
        indicator_mode=None,
    ):

        stats = self.get_context_stats(
            asset=asset,
            action=action,
            session=session,
            regime=regime,
            indicator_mode=indicator_mode,
        )

        learning = self.calculate_adjustment(stats)

        return {
            "context": {
                "asset": asset,
                "action": action,
                "session": session,
                "regime": regime,
                "indicator_mode": indicator_mode,
            },
            "statistics": stats,
            "learning": learning,
        }

    # ========================================
    # APPLY LEARNING TO CONFIDENCE
    # ========================================

    def apply_learning(
        self,
        base_confidence,
        asset=None,
        action=None,
        session=None,
        regime=None,
        indicator_mode=None,
    ):

        learning_report = self.learn_context(
            asset=asset,
            action=action,
            session=session,
            regime=regime,
            indicator_mode=indicator_mode,
        )

        adjustment = learning_report["learning"]["adjustment"]

        final_confidence = base_confidence + adjustment

        final_confidence = max(
            0.0,
            min(
                100.0,
                final_confidence,
            ),
        )

        return {
            "base_confidence": base_confidence,
            "learning_adjustment": adjustment,
            "final_confidence": round(
                final_confidence,
                2,
            ),
            "learning_report": learning_report,
        }
