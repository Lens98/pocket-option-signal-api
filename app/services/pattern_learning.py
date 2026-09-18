from app.database.pattern_repository import PatternRepository
from app.services.pattern_fingerprint import PatternFingerprint


class PatternLearning:

    def __init__(self):

        self.repository = PatternRepository()

        self.fingerprint = PatternFingerprint()

    # ========================================
    # Learn Pattern
    # ========================================

    def learn(self, pattern, result):

        if not isinstance(pattern, str):
            pattern = self.fingerprint.build(pattern)

        self.repository.save_pattern(

            pattern,

            result

        )

    # ========================================
    # Pattern Statistics
    # ========================================

    def statistics(self, signal):

        if isinstance(signal, str):

            pattern = signal

        else:

            pattern = self.fingerprint.build(signal)

        row = self.repository.pattern_stats(pattern)

        if row is None:

            return {

                "pattern": pattern,

                "wins": 0,

                "losses": 0,

                "total": 0,

                "win_rate": 0

            }

        return {

            "pattern": row["pattern"],

            "wins": row["wins"],

            "losses": row["losses"],

            "total": row["total"],

            "win_rate": row["win_rate"]

        }