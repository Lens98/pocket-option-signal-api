import sqlite3
import threading


class DecisionHistoryRepository:

    def __init__(self):

        self.connection = sqlite3.connect(
            "trades.db",
            check_same_thread=False,
            timeout=30
        )

        self.connection.row_factory = sqlite3.Row

        self.lock = threading.Lock()

        self.create_table()

    # ========================================
    # New Cursor
    # ========================================

    def _cursor(self):

        return self.connection.cursor()

    # ========================================
    # Create Table
    # ========================================

    def create_table(self):

        with self.lock:

            cursor = self._cursor()

            cursor.execute("""

            CREATE TABLE IF NOT EXISTS decision_history (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                timestamp TEXT,

                asset TEXT,

                bias TEXT,

                decision TEXT,

                blocked_by TEXT,

                confidence REAL,

                probability REAL,

                agreement REAL,

                confirmations TEXT,

                risk TEXT,

                pattern TEXT

            )

            """)

            self.connection.commit()

    # ========================================
    # Save Decision
    # ========================================

    def save(self, decision):

        with self.lock:

            cursor = self._cursor()

            cursor.execute(

                """
                INSERT INTO decision_history
                (
                    timestamp,
                    asset,
                    bias,
                    decision,
                    blocked_by,
                    confidence,
                    probability,
                    agreement,
                    confirmations,
                    risk,
                    pattern
                )
                VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,

                (

                    decision["time"],
                    decision["asset"],
                    decision["bias"],
                    decision["decision"],
                    decision["blocked_by"],
                    decision["confidence"],
                    decision["probability"],
                    decision["agreement"],
                    decision["confirmations"],
                    decision["risk"],
                    decision["pattern"]

                )

            )

            self.connection.commit()

    # ========================================
    # Recent Decisions
    # ========================================

    def recent(self, limit=50):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT *
                FROM decision_history
                ORDER BY id DESC
                LIMIT ?
                """,

                (limit,)

            ).fetchall()

    # ========================================
    # Decision Counts
    # ========================================

    def decision_counts(self):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT
                    decision,
                    COUNT(*) AS total
                FROM decision_history
                GROUP BY decision
                """

            ).fetchall()

    # ========================================
    # Blocked Statistics
    # ========================================

    def blocked_statistics(self):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT
                    blocked_by,
                    COUNT(*) AS total
                FROM decision_history
                GROUP BY blocked_by
                ORDER BY total DESC
                """

            ).fetchall()

    # ========================================
    # Approval Rate
    # ========================================

    def approval_rate(self):

        with self.lock:

            cursor = self._cursor()

            total = cursor.execute(

                """
                SELECT COUNT(*)
                FROM decision_history
                """

            ).fetchone()[0]

            entered = cursor.execute(

                """
                SELECT COUNT(*)
                FROM decision_history
                WHERE decision='ENTER'
                """

            ).fetchone()[0]

            if total == 0:

                return 0

            return round(

                (entered / total) * 100,

                2

            )