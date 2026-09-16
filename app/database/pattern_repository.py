import sqlite3
import threading


class PatternRepository:

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
    # Create Pattern Table
    # ========================================

    def create_table(self):

        with self.lock:

            cursor = self._cursor()

            cursor.execute("""

            CREATE TABLE IF NOT EXISTS patterns (

                pattern TEXT PRIMARY KEY,

                wins INTEGER DEFAULT 0,

                losses INTEGER DEFAULT 0,

                total INTEGER DEFAULT 0,

                win_rate REAL DEFAULT 0,

               best_session TEXT DEFAULT "",

               best_regime TEXT DEFAULT "",

               average_confidence REAL DEFAULT 0,

               average_agreement REAL DEFAULT 0,

               average_probability REAL DEFAULT 0,

               last_seen TEXT DEFAULT ""

            )

            """)

            self.connection.commit()

    # ========================================
    # Save Pattern Result
    # ========================================

    def save_pattern(self, pattern, result):

        with self.lock:

            cursor = self._cursor()

            row = cursor.execute(

                """
                SELECT *
                FROM patterns
                WHERE pattern=?
                """,

                (pattern,)

            ).fetchone()

            if row is None:

                wins = 1 if result == "WIN" else 0

                losses = 1 if result == "LOSS" else 0

                total = wins + losses

                win_rate = (
                    (wins / total) * 100
                    if total > 0
                    else 0
                )

                cursor.execute(

                    """
                    INSERT INTO patterns
                    (
                        pattern,
                        wins,
                        losses,
                        total,
                        win_rate
                    )
                    VALUES
                    (?, ?, ?, ?, ?)
                    """,

                    (
                        pattern,
                        wins,
                        losses,
                        total,
                        win_rate
                    )

                )

            else:

                wins = row["wins"]

                losses = row["losses"]

                if result == "WIN":

                    wins += 1

                elif result == "LOSS":

                    losses += 1

                total = wins + losses

                win_rate = (
                    (wins / total) * 100
                    if total > 0
                    else 0
                )

                cursor.execute(

                    """
                    UPDATE patterns
                    SET
                        wins=?,
                        losses=?,
                        total=?,
                        win_rate=?
                    WHERE pattern=?
                    """,

                    (
                        wins,
                        losses,
                        total,
                        win_rate,
                        pattern
                    )

                )

            self.connection.commit()

    # ========================================
    # Pattern Statistics
    # ========================================

    def pattern_stats(self, pattern):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT *
                FROM patterns
                WHERE pattern=?
                """,

                (pattern,)

            ).fetchone()

    # ========================================
    # All Patterns
    # ========================================

    def all(self):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT *
                FROM patterns
                ORDER BY win_rate DESC,
                         total DESC
                """

            ).fetchall()

    # ========================================
    # Top Patterns
    # ========================================

    def top(self, limit=20):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(

                """
                SELECT *
                FROM patterns
                WHERE total >= 5
                ORDER BY win_rate DESC,
                         total DESC
                LIMIT ?
                """,

                (limit,)

            ).fetchall()