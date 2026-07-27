import json
import sqlite3

from app.models.trade_learning import TradeLearning


class LearningRepository:

    def __init__(self):

        self.connection = sqlite3.connect(
            "trades.db",
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.cursor = self.connection.cursor()

        self.create_table()

    # ========================================
    # Create Table
    # ========================================

    def create_table(self):

        self.cursor.execute("""

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

        self.cursor.execute("""

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
            ?,?,
            ?,?,
            ?,
            ?,?,
            ?,
            ?

        )

        """, (

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

            record.entry_price,
            record.exit_price,

            record.payout,
            record.profit,

            record.result,

            record.entry_time.isoformat(),
            record.exit_time.isoformat(),

            record.duration,

            json.dumps(record.reasons)

        ))

        self.connection.commit()

    # ========================================
    # Get All Learning Records
    # ========================================

    def all(self):

        return self.cursor.execute(

            "SELECT * FROM learning"

        ).fetchall()

    # ========================================
    # Find by Asset
    # ========================================

    def by_asset(self, asset):

        return self.cursor.execute(

            "SELECT * FROM learning WHERE asset=?",

            (asset,)

        ).fetchall()

    # ========================================
    # Find by Regime
    # ========================================

    def by_regime(self, regime):

        return self.cursor.execute(

            "SELECT * FROM learning WHERE regime=?",

            (regime,)

        ).fetchall()

    # ========================================
    # Find by Session
    # ========================================

    def by_session(self, session):

        return self.cursor.execute(

            "SELECT * FROM learning WHERE session=?",

            (session,)

        ).fetchall()

    # ========================================
    # Total Records
    # ========================================

    def count(self):

        return self.cursor.execute(

            "SELECT COUNT(*) FROM learning"

        ).fetchone()[0]

    # ========================================
    # Asset Statistics
    # ========================================

    def asset_stats(self, asset):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN result='WIN'
                        THEN 1
                        ELSE 0
                    END
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE asset=?

        """, (asset,)).fetchone()

    # ========================================
    # Regime Statistics
    # ========================================

    def regime_stats(self, regime):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN result='WIN'
                        THEN 1
                        ELSE 0
                    END
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE regime=?

        """, (regime,)).fetchone()

    # ========================================
    # Session Statistics
    # ========================================

    def session_stats(self, session):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN result='WIN'
                        THEN 1
                        ELSE 0
                    END
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE session=?

        """, (session,)).fetchone()

    # ========================================
    # Confidence Statistics
    # ========================================

    def confidence_stats(self, minimum):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN result='WIN'
                        THEN 1
                        ELSE 0
                    END
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE confidence>=?

        """, (minimum,)).fetchone()

    # ========================================
    # Indicator Mode Statistics
    # ========================================

    def mode_stats(self, mode):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(
                    CASE
                        WHEN result='WIN'
                        THEN 1
                        ELSE 0
                    END
                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

            WHERE indicator_mode=?

        """, (mode,)).fetchone()
        # ========================================
    # Overall Statistics
    # ========================================

    def overall_stats(self):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(

                    CASE

                        WHEN result='WIN'

                        THEN 1

                        ELSE 0

                    END

                ) AS wins,

                AVG(profit) AS average_profit

            FROM learning

        """).fetchone()

    # ========================================
    # Recent Statistics
    # ========================================

    def recent_stats(self, limit=50):

        return self.cursor.execute("""

            SELECT

                COUNT(*) AS total,

                SUM(

                    CASE

                        WHEN result='WIN'

                        THEN 1

                        ELSE 0

                    END

                ) AS wins

            FROM (

                SELECT result

                FROM learning

                ORDER BY exit_time DESC

                LIMIT ?

            )

        """, (limit,)).fetchone()