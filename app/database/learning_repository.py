import os
import json
import sqlite3
import threading
from pathlib import Path

from app.models.trade_learning import TradeLearning


class LearningRepository:

    def __init__(self):

        volume_path = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")

        if volume_path:
            db_path = Path(volume_path) / "trades.db"
        else:
            base = Path(__file__).resolve().parent.parent
            db_path = base / "trades.db"

        self.connection = sqlite3.connect(db_path, check_same_thread=False, timeout=30)

        self.connection.row_factory = sqlite3.Row

        self.lock = threading.Lock()

        self.create_table()

        self.connection.row_factory = sqlite3.Row

        # SQLite protection
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

        cursor = self._cursor()

        cursor.execute("""

        CREATE TABLE IF NOT EXISTS learning (

            trade_id TEXT PRIMARY KEY,

            asset TEXT,

            timeframe TEXT,

            session TEXT,

            action TEXT,

            indicator_mode TEXT,

            regime TEXT,

            trend TEXT,

            confidence REAL,

            probability REAL,

            risk TEXT,

            grade TEXT,

            ema20 REAL,

            ema50 REAL,

            ema200 REAL,

            rsi REAL,

            macd REAL,

            signal_line REAL,

            histogram REAL,

            adx REAL,

            atr REAL,
            ema_used INTEGER,

rsi_used INTEGER,

macd_used INTEGER,

adx_used INTEGER,

atr_used INTEGER,

            entry_price REAL,

            exit_price REAL,

            payout REAL,

            profit REAL,

            result TEXT,

            entry_time TEXT,

            exit_time TEXT,

            duration REAL,

            reasons TEXT

        )

        """)

        self.connection.commit()

    # ========================================
    # Add Learning Record
    # ========================================

    def add(self, record: TradeLearning):

        with self.lock:

            cursor = self._cursor()

            cursor.execute(
                """

        INSERT OR REPLACE INTO learning (

            trade_id,
            asset,
            timeframe,
            session,
            action,

            indicator_mode,
            regime,
            trend,
            confidence,
            probability,

            risk,
            grade,

            ema20,
            ema50,
            ema200,

            rsi,

            macd,
            signal_line,
            histogram,

            adx,
            atr,
            ema_used,

rsi_used,

macd_used,

adx_used,

atr_used,

            entry_price,
            exit_price,

            payout,
            profit,

            result,

            entry_time,
            exit_time,

            duration,

            reasons

        )

        VALUES (

    ?,?,?,?,?,?,
    ?,?,?,?,
    ?,?,
    ?,?,?,
    ?,
    ?,?,?,
    ?,?,

    ?,?,?,?,?,

    ?,?,
    ?,?,
    ?,
    ?,?,
    ?,
    ?

)

        """,
                (
                    record.trade_id,
                    record.asset,
                    record.timeframe,
                    record.session,
                    record.action,
                    record.indicator_mode,
                    record.regime,
                    record.trend,
                    record.confidence,
                    record.probability,
                    record.risk,
                    record.grade,
                    record.ema20,
                    record.ema50,
                    record.ema200,
                    record.rsi,
                    record.macd,
                    record.signal_line,
                    record.histogram,
                    record.adx,
                    record.atr,
                    int(record.ema_used),
                    int(record.rsi_used),
                    int(record.macd_used),
                    int(record.adx_used),
                    int(record.atr_used),
                    record.entry_price,
                    record.exit_price,
                    record.payout,
                    record.profit,
                    record.result,
                    record.entry_time.isoformat(),
                    record.exit_time.isoformat(),
                    record.duration,
                    json.dumps(record.reasons),
                ),
            )

            self.connection.commit()

    # ========================================
    # Get All
    # ========================================

    def all(self):

        cursor = self._cursor()

        return cursor.execute("SELECT * FROM learning").fetchall()

    # ========================================
    # Find Asset
    # ========================================

    def by_asset(self, asset):

        cursor = self._cursor()

        return cursor.execute(
            "SELECT * FROM learning WHERE asset=?", (asset,)
        ).fetchall()

    # ========================================
    # Find Regime
    # ========================================

    def by_regime(self, regime):

        cursor = self._cursor()

        return cursor.execute(
            "SELECT * FROM learning WHERE regime=?", (regime,)
        ).fetchall()

    # ========================================
    # Find Session
    # ========================================

    def by_session(self, session):

        cursor = self._cursor()

        return cursor.execute(
            "SELECT * FROM learning WHERE session=?", (session,)
        ).fetchall()

    # ========================================
    # Count
    # ========================================

    def count(self):

        cursor = self._cursor()

        return cursor.execute("SELECT COUNT(*) FROM learning").fetchone()[0]

    # ========================================
    # Asset Statistics
    # ========================================

    def asset_stats(self, asset):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE asset=?

        """,
                (asset,),
            ).fetchone()

    # ========================================
    # Regime Statistics
    # ========================================

    def regime_stats(self, regime):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE regime=?

        """,
                (regime,),
            ).fetchone()

    # ========================================
    # Session Statistics
    # ========================================

    def session_stats(self, session):
        with self.lock:

            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE session=?

        """,
                (session,),
            ).fetchone()

    # ========================================
    # Confidence Statistics
    # ========================================

    def confidence_stats(self, minimum):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE confidence>=?

        """,
                (minimum,),
            ).fetchone()

    # ========================================
    # Indicator Mode Statistics
    # ========================================

    def mode_stats(self, mode):

        with self.lock:

            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(
                    SUM(
                        CASE
                            WHEN result='WIN'
                            THEN 1
                            ELSE 0
                        END
                    ),
                    0
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE indicator_mode=?

        """,
                (mode,),
            ).fetchone()

    # ========================================
    # Overall Statistics
    # ========================================

    def overall_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

        """).fetchone()

    # ========================================
    # Recent Statistics
    # ========================================

    def recent_stats(self, limit=50):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute(
                """

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM (

                SELECT result

                FROM learning

                ORDER BY exit_time DESC

                LIMIT ?

            )

        """,
                (limit,),
            ).fetchone()
            # ========================================

    # EMA Statistics
    # ========================================

    def ema_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM learning

            WHERE ema_used=1

        """).fetchone()

    # ========================================
    # RSI Statistics
    # ========================================

    def rsi_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM learning

            WHERE rsi_used=1

        """).fetchone()

    # ========================================
    # MACD Statistics
    # ========================================

    def macd_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM learning

            WHERE macd_used=1

        """).fetchone()

    # ========================================
    # ADX Statistics
    # ========================================

    def adx_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM learning

            WHERE adx_used=1

        """).fetchone()

    # ========================================
    # ATR Statistics
    # ========================================

    def atr_stats(self):
        with self.lock:
            cursor = self._cursor()

            return cursor.execute("""

            SELECT

                COUNT(*) AS total,

                COALESCE(

                    SUM(

                        CASE

                            WHEN result='WIN'

                            THEN 1

                            ELSE 0

                        END

                    ),

                    0

                ) AS wins

            FROM learning

            WHERE atr_used=1

        """).fetchone()
