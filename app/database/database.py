import sqlite3
from pathlib import Path


class Database:

    def __init__(self):

        base = Path(__file__).resolve().parent

        self.db_path = base / "trades.db"

        self.connection = sqlite3.connect(
            self.db_path,
            check_same_thread=False
        )

        self.connection.row_factory = sqlite3.Row

        self.create_tables()

    # ----------------------------------------
    # Create Tables
    # ----------------------------------------

    def create_tables(self):

        cursor = self.connection.cursor()

        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS trades (

                id TEXT PRIMARY KEY,

                asset TEXT,
                timeframe TEXT,

                action TEXT,

                confidence REAL,

                grade TEXT,

                risk TEXT,

                trend TEXT,

                entry_price REAL,

                exit_price REAL,

                entry_time TEXT,

                exit_time TEXT,

                expiration_seconds INTEGER,

                status TEXT,

                result TEXT,

                profit REAL,

                payout REAL,

                reasons TEXT

            )
            """
        )

        self.connection.commit()

    # ----------------------------------------
    # Execute
    # ----------------------------------------

    def execute(
        self,
        query,
        params=()
    ):

        cursor = self.connection.cursor()

        cursor.execute(query, params)

        self.connection.commit()

        return cursor

    # ----------------------------------------
    # Fetch One
    # ----------------------------------------

    def fetch_one(
        self,
        query,
        params=()
    ):

        cursor = self.execute(query, params)

        return cursor.fetchone()

    # ----------------------------------------
    # Fetch All
    # ----------------------------------------

    def fetch_all(
        self,
        query,
        params=()
    ):

        cursor = self.execute(query, params)

        return cursor.fetchall()


database = Database()