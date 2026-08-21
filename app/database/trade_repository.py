import json
from datetime import datetime

from app.database.database import database
from app.models.trade import Trade


class TradeRepository:

    # ----------------------------------------
    # Convert SQLite Row -> Trade
    # ----------------------------------------

    def _row_to_trade(self, row):

        if row is None:
            return None

        return Trade(
            id=row["id"],
            user_id=row["user_id"],
            asset=row["asset"],
            timeframe=row["timeframe"],
            action=row["action"],
            confidence=row["confidence"],
            grade=row["grade"],
            risk=row["risk"],
            trend=row["trend"],
            entry_price=row["entry_price"],
            exit_price=row["exit_price"],
            entry_time=datetime.fromisoformat(row["entry_time"]),
            exit_time=(
                datetime.fromisoformat(row["exit_time"]) if row["exit_time"] else None
            ),
            expiration_seconds=row["expiration_seconds"],
            status=row["status"],
            result=row["result"],
            profit=row["profit"],
            payout=row["payout"],
            reasons=json.loads(row["reasons"]) if row["reasons"] else [],
        )

    # ----------------------------------------
    # Save Trade
    # ----------------------------------------

    def add(self, trade: Trade):

        database.execute(
            """
            INSERT INTO trades (
                id,
                user_id,
                asset,
                timeframe,
                action,
                confidence,
                grade,
                risk,
                trend,
                entry_price,
                exit_price,
                entry_time,
                exit_time,
                expiration_seconds,
                status,
                result,
                profit,
                payout,
                reasons
            )
            VALUES (
                ?,?,?,?,?,?,?,?,?,?,
                ?,?,?,?,?,?,?,?,?
            )
            """,
            (
                trade.id,
                trade.user_id,
                trade.asset,
                trade.timeframe,
                trade.action,
                trade.confidence,
                trade.grade,
                trade.risk,
                trade.trend,
                trade.entry_price,
                trade.exit_price,
                trade.entry_time.isoformat(),
                trade.exit_time.isoformat() if trade.exit_time else None,
                trade.expiration_seconds,
                trade.status,
                trade.result,
                trade.profit,
                trade.payout,
                json.dumps(trade.reasons),
            ),
        )

    # ----------------------------------------
    # Update Trade
    # ----------------------------------------

    def update(self, trade: Trade):

        database.execute(
            """
            UPDATE trades

            SET
                user_id=?,
                asset=?,
                timeframe=?,
                action=?,
                confidence=?,
                grade=?,
                risk=?,
                trend=?,
                entry_price=?,
                exit_price=?,
                entry_time=?,
                exit_time=?,
                expiration_seconds=?,
                status=?,
                result=?,
                profit=?,
                payout=?,
                reasons=?

            WHERE id=?
            """,
            (
                trade.user_id,
                trade.asset,
                trade.timeframe,
                trade.action,
                trade.confidence,
                trade.grade,
                trade.risk,
                trade.trend,
                trade.entry_price,
                trade.exit_price,
                trade.entry_time.isoformat(),
                trade.exit_time.isoformat() if trade.exit_time else None,
                trade.expiration_seconds,
                trade.status,
                trade.result,
                trade.profit,
                trade.payout,
                json.dumps(trade.reasons),
                trade.id,
            ),
        )

    # ----------------------------------------
    # Find Trade
    # ----------------------------------------

    def find(self, trade_id, user_id=None):

        if user_id is None:

            row = database.fetch_one(
                """
                SELECT *
                FROM trades
                WHERE id=?
                """,
                (trade_id,),
            )

        else:

            row = database.fetch_one(
                """
                SELECT *
                FROM trades
                WHERE id=?
                AND user_id=?
                """,
                (trade_id, user_id),
            )

        return self._row_to_trade(row)

    # ----------------------------------------
    # Latest Trade
    # ----------------------------------------

    def latest(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("""
                SELECT *
                FROM trades
                ORDER BY entry_time DESC
                LIMIT 1
                """)

        else:

            row = database.fetch_one(
                """
                SELECT *
                FROM trades
                WHERE user_id=?
                ORDER BY entry_time DESC
                LIMIT 1
                """,
                (user_id,),
            )

        return self._row_to_trade(row)

    # ----------------------------------------
    # All Trades
    # ----------------------------------------

    def all(self, user_id=None):

        if user_id is None:

            rows = database.fetch_all("""
                SELECT *
                FROM trades
                ORDER BY entry_time DESC
                """)

        else:

            rows = database.fetch_all(
                """
                SELECT *
                FROM trades
                WHERE user_id=?
                ORDER BY entry_time DESC
                """,
                (user_id,),
            )

        return [self._row_to_trade(row) for row in rows]

    # ----------------------------------------
    # Open Trades
    # ----------------------------------------

    def open_trades(self, user_id=None):

        if user_id is None:

            rows = database.fetch_all("""
                SELECT *
                FROM trades
                WHERE status='OPEN'
                ORDER BY entry_time DESC
                """)

        else:

            rows = database.fetch_all(
                """
                SELECT *
                FROM trades
                WHERE status='OPEN'
                AND user_id=?
                ORDER BY entry_time DESC
                """,
                (user_id,),
            )

        return [self._row_to_trade(row) for row in rows]

    # ----------------------------------------
    # Closed Trades
    # ----------------------------------------

    def closed_trades(self, user_id=None):

        if user_id is None:

            rows = database.fetch_all("""
                SELECT *
                FROM trades
                WHERE status='CLOSED'
                ORDER BY exit_time DESC
                """)

        else:

            rows = database.fetch_all(
                """
                SELECT *
                FROM trades
                WHERE status='CLOSED'
                AND user_id=?
                ORDER BY exit_time DESC
                """,
                (user_id,),
            )

        return [self._row_to_trade(row) for row in rows]

    # ----------------------------------------
    # Count
    # ----------------------------------------

    def count(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("SELECT COUNT(*) AS total FROM trades")

        else:

            row = database.fetch_one(
                """
                SELECT COUNT(*) AS total
                FROM trades
                WHERE user_id=?
                """,
                (user_id,),
            )

        return row["total"]

    # ----------------------------------------
    # Win Count
    # ----------------------------------------

    def win_count(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("""
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='WIN'
                """)

        else:

            row = database.fetch_one(
                """
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='WIN'
                AND user_id=?
                """,
                (user_id,),
            )

        return row["total"]

    # ----------------------------------------
    # Loss Count
    # ----------------------------------------

    def loss_count(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("""
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='LOSS'
                """)

        else:

            row = database.fetch_one(
                """
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='LOSS'
                AND user_id=?
                """,
                (user_id,),
            )

        return row["total"]

    # ----------------------------------------
    # Draw Count
    # ----------------------------------------

    def draw_count(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("""
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='DRAW'
                """)

        else:

            row = database.fetch_one(
                """
                SELECT COUNT(*) AS total
                FROM trades
                WHERE result='DRAW'
                AND user_id=?
                """,
                (user_id,),
            )

        return row["total"]

    # ----------------------------------------
    # Win Rate
    # ----------------------------------------

    def win_rate(self, user_id=None):

        total = self.count(user_id)

        if total == 0:
            return 0.0

        return round(
            self.win_count(user_id) / total * 100,
            2,
        )

    # ----------------------------------------
    # Statistics
    # ----------------------------------------

    def statistics(self, user_id=None):

        if user_id is None:

            row = database.fetch_one("""
                SELECT
                    COALESCE(
                        SUM(profit),
                        0
                    ) AS profit
                FROM trades
                """)

        else:

            row = database.fetch_one(
                """
                SELECT
                    COALESCE(
                        SUM(profit),
                        0
                    ) AS profit
                FROM trades
                WHERE user_id=?
                """,
                (user_id,),
            )

        profit = float(row["profit"] or 0)

        return {
            "total": self.count(user_id),
            "wins": self.win_count(user_id),
            "losses": self.loss_count(user_id),
            "draws": self.draw_count(user_id),
            "win_rate": self.win_rate(user_id),
            "profit": round(profit, 2),
        }

    # ----------------------------------------
    # Today's Statistics
    # Based on Trade Entry Time
    # ----------------------------------------

    def today_statistics(self, user_id=None):

        today = datetime.now().date().isoformat()

        if user_id is None:

            row = database.fetch_one(
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

                    COALESCE(
                        SUM(
                            CASE
                                WHEN result='LOSS'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS losses,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN result='DRAW'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS draws,

                    COALESCE(
                        SUM(profit),
                        0
                    ) AS profit

                FROM trades

                WHERE date(entry_time)=?
                """,
                (today,),
            )

        else:

            row = database.fetch_one(
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

                    COALESCE(
                        SUM(
                            CASE
                                WHEN result='LOSS'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS losses,

                    COALESCE(
                        SUM(
                            CASE
                                WHEN result='DRAW'
                                THEN 1
                                ELSE 0
                            END
                        ),
                        0
                    ) AS draws,

                    COALESCE(
                        SUM(profit),
                        0
                    ) AS profit

                FROM trades

                WHERE date(entry_time)=?
                AND user_id=?
                """,
                (today, user_id),
            )

        total = int(row["total"] or 0)
        wins = int(row["wins"] or 0)
        losses = int(row["losses"] or 0)
        draws = int(row["draws"] or 0)
        profit = float(row["profit"] or 0)

        decided_trades = wins + losses

        if decided_trades == 0:
            win_rate = 0.0
        else:
            win_rate = round(
                wins / decided_trades * 100,
                2,
            )

        return {
            "total": total,
            "wins": wins,
            "losses": losses,
            "draws": draws,
            "win_rate": win_rate,
            "profit": round(profit, 2),
        }

    # ----------------------------------------
    # Delete Trade
    # ----------------------------------------

    def delete(self, trade_id, user_id=None):

        if user_id is None:

            database.execute(
                "DELETE FROM trades WHERE id=?",
                (trade_id,),
            )

        else:

            database.execute(
                """
                DELETE FROM trades
                WHERE id=?
                AND user_id=?
                """,
                (trade_id, user_id),
            )

    # ----------------------------------------
    # Clear Database
    # ----------------------------------------

    def clear(self, user_id=None):

        if user_id is None:

            database.execute("DELETE FROM trades")

        else:

            database.execute(
                """
                DELETE FROM trades
                WHERE user_id=?
                """,
                (user_id,),
            )
