from collections import defaultdict

from app.database.database import database


class PerformanceAnalyzer:

    # ========================================
    # GET CLOSED TRADES
    # ========================================

    def get_closed_trades(self, user_id=None):

        query = """
            SELECT
                id,
                user_id,
                asset,
                action,
                confidence,
                probability,
                agreement_score,
                session,
                regime,
                indicator_mode,
                pattern,
                grade,
                risk,
                trend,
                status,
                result,
                entry_time
            FROM trades
            WHERE status = 'CLOSED'
              AND result IN ('WIN', 'LOSS')
        """

        params = []

        if user_id is not None:
            query += """
                AND user_id = ?
            """
            params.append(user_id)

        query += """
            ORDER BY entry_time DESC
        """

        return database.fetch_all(
            query,
            tuple(params),
        )
        # ========================================

    # GET CONTEXT-RICH LEARNING TRADES
    # ========================================

    def get_context_trades(self, user_id=None):

        query = """
            SELECT
                id,
                user_id,
                asset,
                action,
                confidence,
                probability,
                agreement_score,
                session,
                regime,
                indicator_mode,
                pattern,
                grade,
                risk,
                trend,
                status,
                result,
                entry_time
            FROM trades
            WHERE status = 'CLOSED'
              AND result IN ('WIN', 'LOSS')
              AND session IS NOT NULL
              AND session != ''
              AND session != 'UNKNOWN'
              AND regime IS NOT NULL
              AND regime != ''
              AND regime != 'UNKNOWN'
              AND indicator_mode IS NOT NULL
              AND indicator_mode != ''
              AND indicator_mode != 'UNKNOWN'
        """

        params = []

        if user_id is not None:
            query += """
                AND user_id = ?
            """
            params.append(user_id)

        query += """
            ORDER BY entry_time DESC
        """

        return database.fetch_all(
            query,
            tuple(params),
        )
        # ========================================

    # CONTEXT-ONLY GROUP PERFORMANCE
    # ========================================

    def context_group_by(self, field, user_id=None):

        trades = self.get_context_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            value = trade[field]

            if value is None or value == "":
                value = "UNKNOWN"

            groups[value].append(trade)

        results = {}

        for value, group_trades in groups.items():

            results[value] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # CONTEXT-ONLY PERFORMANCE REPORT
    # ========================================

    def context_report(self, user_id=None):

        trades = self.get_context_trades(user_id)

        return {
            "overall": self.calculate_statistics(trades),
            "by_asset": self.context_group_by(
                "asset",
                user_id,
            ),
            "by_action": self.context_group_by(
                "action",
                user_id,
            ),
            "by_session": self.context_group_by(
                "session",
                user_id,
            ),
            "by_regime": self.context_group_by(
                "regime",
                user_id,
            ),
            "by_indicator_mode": self.context_group_by(
                "indicator_mode",
                user_id,
            ),
            "by_pattern": self.context_group_by(
                "pattern",
                user_id,
            ),
        }

    # ========================================
    # CALCULATE STATISTICS
    # ========================================

    def calculate_statistics(self, trades):

        total = len(trades)

        wins = sum(1 for trade in trades if trade["result"] == "WIN")

        losses = sum(1 for trade in trades if trade["result"] == "LOSS")

        win_rate = round((wins / total) * 100, 2) if total > 0 else 0.0

        return {
            "total_trades": total,
            "wins": wins,
            "losses": losses,
            "win_rate": win_rate,
        }

    # ========================================
    # OVERALL PERFORMANCE
    # ========================================

    def overall(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        return self.calculate_statistics(trades)

    # ========================================
    # GROUP PERFORMANCE
    # ========================================

    def group_by(self, field, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            value = trade[field]

            if value is None or value == "":
                value = "UNKNOWN"

            groups[value].append(trade)

        results = {}

        for value, group_trades in groups.items():

            results[value] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # PERFORMANCE BY ASSET
    # ========================================

    def by_asset(self, user_id=None):

        return self.group_by(
            "asset",
            user_id,
        )

    # ========================================
    # PERFORMANCE BY SESSION
    # ========================================

    def by_session(self, user_id=None):

        return self.group_by(
            "session",
            user_id,
        )

    # ========================================
    # PERFORMANCE BY REGIME
    # ========================================

    def by_regime(self, user_id=None):

        return self.group_by(
            "regime",
            user_id,
        )

    # ========================================
    # PERFORMANCE BY INDICATOR MODE
    # ========================================

    def by_indicator_mode(self, user_id=None):

        return self.group_by(
            "indicator_mode",
            user_id,
        )

    # ========================================
    # PERFORMANCE BY PATTERN
    # ========================================

    def by_pattern(self, user_id=None):

        return self.group_by(
            "pattern",
            user_id,
        )

    # ========================================
    # FULL PERFORMANCE REPORT
    # ========================================

    # ========================================
    # FULL PERFORMANCE REPORT
    # ========================================

    def full_report(self, user_id=None):

        return {
            "overall": self.overall(user_id),
            "by_asset": self.by_asset(user_id),
            "by_action": self.by_action(user_id),
            "by_session": self.by_session(user_id),
            "by_regime": self.by_regime(user_id),
            "by_indicator_mode": self.by_indicator_mode(user_id),
            "by_pattern": self.by_pattern(user_id),
            "by_confidence": self.by_confidence(user_id),
            "by_confidence_and_session": self.by_confidence_and_session(user_id),
            "by_session_and_regime": self.by_session_and_regime(user_id),
            "by_regime_and_indicator_mode": self.by_regime_and_indicator_mode(user_id),
            "by_action_and_session": self.by_action_and_session(user_id),
            "best_combinations": self.best_combinations(user_id),
        }

    # ========================================
    # PERFORMANCE BY ACTION
    # ========================================

    def by_action(self, user_id=None):

        return self.group_by(
            "action",
            user_id,
        )

    # ========================================
    # PERFORMANCE BY CONFIDENCE + SESSION
    # ========================================

    def by_confidence_and_session(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            confidence = self.confidence_range(trade["confidence"])

            session = trade["session"]

            if session is None or session == "":
                session = "UNKNOWN"

            key = f"{confidence} | {session}"

            groups[key].append(trade)

        results = {}

        for key, group_trades in groups.items():

            results[key] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # PERFORMANCE BY SESSION + REGIME
    # ========================================

    def by_session_and_regime(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            session = trade["session"]
            regime = trade["regime"]

            if session is None or session == "":
                session = "UNKNOWN"

            if regime is None or regime == "":
                regime = "UNKNOWN"

            key = f"{session} | {regime}"

            groups[key].append(trade)

        results = {}

        for key, group_trades in groups.items():

            results[key] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # PERFORMANCE BY REGIME + MODE
    # ========================================

    def by_regime_and_indicator_mode(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            regime = trade["regime"]
            mode = trade["indicator_mode"]

            if regime is None or regime == "":
                regime = "UNKNOWN"

            if mode is None or mode == "":
                mode = "UNKNOWN"

            key = f"{regime} | {mode}"

            groups[key].append(trade)

        results = {}

        for key, group_trades in groups.items():

            results[key] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # PERFORMANCE BY ACTION + SESSION
    # ========================================

    def by_action_and_session(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            action = trade["action"]
            session = trade["session"]

            if action is None or action == "":
                action = "UNKNOWN"

            if session is None or session == "":
                session = "UNKNOWN"

            key = f"{action} | {session}"

            groups[key].append(trade)

        results = {}

        for key, group_trades in groups.items():

            results[key] = self.calculate_statistics(group_trades)

        return results

    # ========================================
    # BEST PERFORMING COMBINATIONS
    # ========================================

    def best_combinations(
        self,
        user_id=None,
        minimum_trades=10,
    ):

        combinations = []

        analyses = {
            "confidence_session": self.by_confidence_and_session(user_id),
            "session_regime": self.by_session_and_regime(user_id),
            "regime_indicator_mode": self.by_regime_and_indicator_mode(user_id),
            "action_session": self.by_action_and_session(user_id),
        }

        for category, results in analyses.items():

            for combination, stats in results.items():

                if stats["total_trades"] >= minimum_trades:

                    combinations.append(
                        {
                            "category": category,
                            "combination": combination,
                            "total_trades": stats["total_trades"],
                            "wins": stats["wins"],
                            "losses": stats["losses"],
                            "win_rate": stats["win_rate"],
                        }
                    )

        combinations.sort(
            key=lambda item: (
                item["win_rate"],
                item["total_trades"],
            ),
            reverse=True,
        )

        return combinations

    # ========================================
    # CONFIDENCE RANGE
    # ========================================

    def confidence_range(self, confidence):

        if confidence is None:
            return "UNKNOWN"

        if confidence >= 90:
            return "90-100"

        if confidence >= 80:
            return "80-89"

        if confidence >= 70:
            return "70-79"

        if confidence >= 60:
            return "60-69"

        return "BELOW-60"

    # ========================================
    # PERFORMANCE BY CONFIDENCE
    # ========================================

    def by_confidence(self, user_id=None):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            confidence = trade["confidence"]

            bucket = self.confidence_range(confidence)

            groups[bucket].append(trade)

        results = {}

        order = [
            "90-100",
            "80-89",
            "70-79",
            "60-69",
            "BELOW-60",
            "UNKNOWN",
        ]

        for bucket in order:

            if bucket in groups:

                results[bucket] = self.calculate_statistics(groups[bucket])

        return results
        # ========================================

    # BEST CONTEXT COMBINATIONS
    # Only use complete context for learning
    # ========================================

    def best_context_combinations(
        self,
        user_id=None,
        minimum_trades=20,
    ):

        trades = self.get_closed_trades(user_id)

        groups = defaultdict(list)

        for trade in trades:

            session = trade["session"]
            regime = trade["regime"]
            indicator_mode = trade["indicator_mode"]

            # Ignore incomplete historical context
            if (
                not session
                or session == "UNKNOWN"
                or not regime
                or regime == "UNKNOWN"
                or not indicator_mode
                or indicator_mode == "UNKNOWN"
            ):
                continue

            key = f"{session}" f" | {regime}" f" | {indicator_mode}"

            groups[key].append(trade)

        results = []

        for combination, group_trades in groups.items():

            stats = self.calculate_statistics(group_trades)

            if stats["total_trades"] < minimum_trades:
                continue

            results.append(
                {
                    "combination": combination,
                    "total_trades": stats["total_trades"],
                    "wins": stats["wins"],
                    "losses": stats["losses"],
                    "win_rate": stats["win_rate"],
                }
            )

        results.sort(
            key=lambda item: (
                item["win_rate"],
                item["total_trades"],
            ),
            reverse=True,
        )

        return results
