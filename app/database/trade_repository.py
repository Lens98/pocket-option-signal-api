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
                datetime.fromisoformat(row["exit_time"])
                if row["exit_time"]
                else None
            ),

            expiration_seconds=row["expiration_seconds"],

            status=row["status"],

            result=row["result"],

            profit=row["profit"],

            payout=row["payout"],

            reasons=json.loads(row["reasons"])
            if row["reasons"]
            else []

        )

    # ----------------------------------------
    # Save Trade
    # ----------------------------------------

    def add(self, trade: Trade):

        database.execute(

            """
            INSERT INTO trades (

                id,
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
                ?,?,?,?,?,?,?,?

            )

            """,

            (

                trade.id,
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
                json.dumps(trade.reasons)

            )

        )

    # ----------------------------------------
    # Update Trade
    # ----------------------------------------

    def update(self, trade: Trade):

        database.execute(

            """
            UPDATE trades

            SET

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
                trade.id

            )

        )

    # ----------------------------------------
    # Find Trade
    # ----------------------------------------

    def find(self, trade_id):

        row = database.fetch_one(

            "SELECT * FROM trades WHERE id=?",

            (trade_id,)

        )

        return self._row_to_trade(row)

    # ----------------------------------------
    # Latest Trade
    # ----------------------------------------

    def latest(self):

        row = database.fetch_one(

            """
            SELECT *
            FROM trades
            ORDER BY entry_time DESC
            LIMIT 1
            """

        )

        return self._row_to_trade(row)

    # ----------------------------------------
    # All Trades
    # ----------------------------------------

    def all(self):

        rows = database.fetch_all(

            """
            SELECT *
            FROM trades
            ORDER BY entry_time DESC
            """

        )

        return [

            self._row_to_trade(row)

            for row in rows

        ]

    # ----------------------------------------
    # Open Trades
    # ----------------------------------------

    def open_trades(self):

        rows = database.fetch_all(

            """
            SELECT *
            FROM trades
            WHERE status='OPEN'
            ORDER BY entry_time DESC
            """

        )

        return [

            self._row_to_trade(row)

            for row in rows

        ]

    # ----------------------------------------
    # Closed Trades
    # ----------------------------------------

    def closed_trades(self):

        rows = database.fetch_all(

            """
            SELECT *
            FROM trades
            WHERE status='CLOSED'
            ORDER BY exit_time DESC
            """

        )

        return [

            self._row_to_trade(row)

            for row in rows

        ]

    # ----------------------------------------
    # Count
    # ----------------------------------------

    def count(self):

        row = database.fetch_one(

            "SELECT COUNT(*) AS total FROM trades"

        )

        return row["total"]

    # ----------------------------------------
    # Win Count
    # ----------------------------------------

    def win_count(self):

        row = database.fetch_one(

            """
            SELECT COUNT(*) AS total
            FROM trades
            WHERE result='WIN'
            """

        )

        return row["total"]

    # ----------------------------------------
    # Loss Count
    # ----------------------------------------

    def loss_count(self):

        row = database.fetch_one(

            """
            SELECT COUNT(*) AS total
            FROM trades
            WHERE result='LOSS'
            """

        )

        return row["total"]

    # ----------------------------------------
    # Draw Count
    # ----------------------------------------

    def draw_count(self):

        row = database.fetch_one(

            """
            SELECT COUNT(*) AS total
            FROM trades
            WHERE result='DRAW'
            """

        )

        return row["total"]

    # ----------------------------------------
    # Win Rate
    # ----------------------------------------

    def win_rate(self):

        total = self.count()

        if total == 0:

            return 0.0

        return round(

            self.win_count() / total * 100,

            2

        )

    # ----------------------------------------
    # Statistics
    # ----------------------------------------

    def statistics(self):

        return {

            "total": self.count(),

            "wins": self.win_count(),

            "losses": self.loss_count(),

            "draws": self.draw_count(),

            "win_rate": self.win_rate()

        }

    # ----------------------------------------
    # Delete Trade
    # ----------------------------------------

    def delete(self, trade_id):

        database.execute(

            "DELETE FROM trades WHERE id=?",

            (trade_id,)

        )

    # ----------------------------------------
    # Clear Database
    # ----------------------------------------

    def clear(self):

        database.execute(

            "DELETE FROM trades"

        )