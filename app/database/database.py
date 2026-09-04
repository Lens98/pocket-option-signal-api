import os
import sqlite3
from pathlib import Path


class Database:

    def __init__(self):

        volume_path = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")

        if volume_path:
            self.db_path = Path(volume_path) / "trades.db"
        else:
            base = Path(__file__).resolve().parent
            self.db_path = base / "trades.db"

        self.connection = sqlite3.connect(self.db_path, check_same_thread=False)

        self.connection.row_factory = sqlite3.Row

        self.create_tables()

    # ----------------------------------------
    # Create Tables
    # ----------------------------------------

    def create_tables(self):

        cursor = self.connection.cursor()

        # ----------------------------------------
        # Trades table - EXISTING
        # ----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS trades (

                id TEXT PRIMARY KEY,

                user_id TEXT,

                asset TEXT,

                timeframe TEXT,

                action TEXT,

                confidence REAL,

                probability REAL DEFAULT 0.0,

                agreement_score REAL DEFAULT 0.0,

                grade TEXT,

                risk TEXT,

                trend TEXT,

                regime TEXT DEFAULT 'UNKNOWN',

                session TEXT DEFAULT 'UNKNOWN',

                indicator_mode TEXT DEFAULT 'UNKNOWN',

                entry_price REAL,

                exit_price REAL,

                entry_time TEXT,

                exit_time TEXT,

                expiration_seconds INTEGER,

                status TEXT,

                result TEXT,

                profit REAL,

                payout REAL,

                reasons TEXT,

                pattern TEXT DEFAULT ''

             )
        """)
        # ----------------------------------------
        # Migrate existing trades table safely
        # ----------------------------------------

        columns = {
            row["name"]
            for row in cursor.execute("PRAGMA table_info(trades)").fetchall()
        }

        migrations = {
            "user_id": "TEXT",
            "probability": "REAL DEFAULT 0.0",
            "agreement_score": "REAL DEFAULT 0.0",
            "regime": "TEXT DEFAULT 'UNKNOWN'",
            "session": "TEXT DEFAULT 'UNKNOWN'",
            "indicator_mode": "TEXT DEFAULT 'UNKNOWN'",
            "pattern": "TEXT DEFAULT ''",
        }

        for column, definition in migrations.items():

            if column not in columns:

                print(f"Database migration: adding trades.{column}")

                cursor.execute(
                    f"ALTER TABLE trades " f"ADD COLUMN {column} {definition}"
                )

        # ----------------------------------------
        # Users table - NEW
        # ----------------------------------------
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (

                id TEXT PRIMARY KEY,

                email TEXT UNIQUE NOT NULL,

                password_hash TEXT NOT NULL,

                role TEXT NOT NULL DEFAULT 'user',

                created_at TEXT NOT NULL

            )
            """)
        # ----------------------------------------
        # Add role to existing users table
        # ----------------------------------------

        user_columns = {
            row["name"] for row in cursor.execute("PRAGMA table_info(users)").fetchall()
        }

        if "role" not in user_columns:

            cursor.execute("""
            ALTER TABLE users
            ADD COLUMN role TEXT NOT NULL DEFAULT 'user'
            """)
        # ----------------------------------------
        # Sessions table - NEW
        # ----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS sessions (

                token TEXT PRIMARY KEY,

                user_id TEXT NOT NULL,

                created_at TEXT NOT NULL,

                expires_at TEXT NOT NULL,

                FOREIGN KEY (user_id) REFERENCES users(id)

            )
            """)
        # ----------------------------------------
        # User Preferences
        # ----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (

                user_id TEXT PRIMARY KEY,

                selected_asset TEXT,

                created_at TEXT NOT NULL,

                updated_at TEXT NOT NULL,

                FOREIGN KEY (user_id) REFERENCES users(id)

            )
            """)
        # ----------------------------------------
        # Subscriptions
        # ----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subscriptions (

                id TEXT PRIMARY KEY,

                user_id TEXT NOT NULL,

                 plan TEXT NOT NULL DEFAULT 'NONE',

                status TEXT NOT NULL DEFAULT 'inactive',

                started_at TEXT,

                expires_at TEXT,

                created_at TEXT NOT NULL,

                updated_at TEXT NOT NULL,

               FOREIGN KEY (user_id)
                   REFERENCES users(id)
           )
         """)
        # ----------------------------------------
        # Coupons
        # ----------------------------------------

        cursor.execute("""
           CREATE TABLE IF NOT EXISTS coupons (
               id TEXT PRIMARY KEY,
               code TEXT UNIQUE NOT NULL,
               discount_type TEXT NOT NULL DEFAULT 'percent',
               discount_value REAL NOT NULL DEFAULT 0,
               max_uses INTEGER,
               used_count INTEGER NOT NULL DEFAULT 0,
               status TEXT NOT NULL DEFAULT 'active',
               expires_at TEXT,
               created_at TEXT NOT NULL,
               updated_at TEXT NOT NULL
           )
        """)

        # ----------------------------------------
        # Payments
        # ----------------------------------------

        cursor.execute("""
           CREATE TABLE IF NOT EXISTS payments (
               id TEXT PRIMARY KEY,
               user_id TEXT NOT NULL,
               subscription_id TEXT,
               amount REAL NOT NULL DEFAULT 0,
               currency TEXT NOT NULL DEFAULT 'USD',
               payment_method TEXT NOT NULL,
               crypto_currency TEXT,
               network TEXT,
               transaction_id TEXT,
               wallet_address TEXT,
               status TEXT NOT NULL DEFAULT 'pending',
               description TEXT,
               paid_at TEXT,
               created_at TEXT NOT NULL,
               updated_at TEXT NOT NULL,
               FOREIGN KEY (user_id)
                   REFERENCES users(id),
               FOREIGN KEY (subscription_id)
                   REFERENCES subscriptions(id)
           )
        """)
        # ----------------------------------------
        # Admin Logs
        # ----------------------------------------

        cursor.execute("""
           CREATE TABLE IF NOT EXISTS admin_logs (

               id INTEGER PRIMARY KEY AUTOINCREMENT,

               admin_id TEXT,

               action TEXT NOT NULL,

               target_type TEXT,

               target_id TEXT,

               details TEXT,

               created_at TEXT NOT NULL

           )
        """)
        # ----------------------------------------
        # API Keys
        # ----------------------------------------

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (

                id TEXT PRIMARY KEY,

                user_id TEXT NOT NULL,

                name TEXT NOT NULL,

                key_hash TEXT NOT NULL UNIQUE,

                status TEXT NOT NULL DEFAULT 'active',

                created_at TEXT NOT NULL,

                last_used_at TEXT,

                expires_at TEXT,

                FOREIGN KEY (user_id) REFERENCES users(id)

            )
        """)
        # ----------------------------------------
        # Admin Settings
        # ----------------------------------------

        cursor.execute("""
           CREATE TABLE IF NOT EXISTS admin_settings (

               id INTEGER PRIMARY KEY CHECK (id = 1),

               app_name TEXT NOT NULL DEFAULT 'Pocket Option AI PRO',

               maintenance_mode INTEGER NOT NULL DEFAULT 0,

               allow_registrations INTEGER NOT NULL DEFAULT 1,

               enable_signals INTEGER NOT NULL DEFAULT 1,

               default_timeframe TEXT NOT NULL DEFAULT '5m',

               minimum_confidence REAL NOT NULL DEFAULT 70,

               minimum_agreement REAL NOT NULL DEFAULT 70,

               updated_at TEXT NOT NULL

           )
        """)

        cursor.execute("""
           INSERT OR IGNORE INTO admin_settings (
               id,
               app_name,
               maintenance_mode,
               allow_registrations,
               enable_signals,
               default_timeframe,
               minimum_confidence,
               minimum_agreement,
               updated_at
           )
           VALUES (
               1,
               'Pocket Option AI PRO',
               0,
               1,
               1,
               '5m',
               70,
               70,
               datetime('now')
           )
        """)

        self.connection.commit()

    # ----------------------------------------
    # Execute
    # ----------------------------------------

    def execute(self, query, params=()):

        cursor = self.connection.cursor()

        cursor.execute(query, params)

        self.connection.commit()

        return cursor

    # ----------------------------------------
    # Fetch One
    # ----------------------------------------

    def fetch_one(self, query, params=()):

        cursor = self.execute(query, params)

        return cursor.fetchone()

    # ----------------------------------------
    # Fetch All
    # ----------------------------------------

    def fetch_all(self, query, params=()):

        cursor = self.execute(query, params)

        return cursor.fetchall()


database = Database()
