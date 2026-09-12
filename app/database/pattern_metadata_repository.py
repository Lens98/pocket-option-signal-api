import sqlite3
import threading
from datetime import datetime


class PatternMetadataRepository:

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
    # Cursor
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

            CREATE TABLE IF NOT EXISTS pattern_metadata (

                id INTEGER PRIMARY KEY AUTOINCREMENT,

                pattern TEXT,

                asset TEXT,

                timeframe TEXT,

                session TEXT,

                regime TEXT,

                action TEXT,

                confidence REAL,

                probability REAL,

                agreement REAL,

                risk TEXT,

                grade TEXT,

                result TEXT,

                created_at TEXT

            )

            """)

            self.connection.commit()

    # ========================================
    # Save Trade
    # ========================================

    def save(self, trade):

        with self.lock:

            cursor = self._cursor()

            cursor.execute("""

            INSERT INTO pattern_metadata (

                pattern,

                asset,

                timeframe,

                session,

                regime,

                action,

                confidence,

                probability,

                agreement,

                risk,

                grade,

                result,

                created_at

            )

            VALUES

            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

            """, (

                trade.pattern,

                trade.asset,

                trade.timeframe,

                trade.session,

                trade.regime,

                trade.action,

                trade.confidence,

                trade.probability,

                trade.agreement_score,

                trade.risk,

                trade.grade,

                trade.result,

                datetime.now().isoformat()

            ))

            self.connection.commit()

    # ========================================
    # All Records
    # ========================================

    def all(self):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute("""

            SELECT *

            FROM pattern_metadata

            ORDER BY id DESC

            """).fetchall()