import os
import sys
import json
import sqlite3
from pathlib import Path
from datetime import datetime

# Allow imports from the project root
ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

from app.database.learning_repository import LearningRepository
from app.models.trade_learning import TradeLearning


def get_database_path():
    volume_path = os.getenv("RAILWAY_VOLUME_MOUNT_PATH")

    if volume_path:
        return Path(volume_path) / "trades.db"

    return ROOT / "trades.db"


def parse_datetime(value):
    if not value:
        return datetime.utcnow()

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except Exception:
        return datetime.utcnow()


def get_session(entry_time):
    """Simple historical session classification from UTC hour."""
    try:
        hour = entry_time.hour

        if 0 <= hour < 8:
            return "ASIA"
        elif 8 <= hour < 13:
            return "LONDON"
        elif 13 <= hour < 17:
            return "NEW_YORK"
        else:
            return "OFF_SESSION"
    except Exception:
        return "UNKNOWN"


def parse_reasons(value):
    if not value:
        return []

    try:
        data = json.loads(value)
        return data if isinstance(data, list) else []
    except Exception:
        return []


def find_reason(reasons, prefix):
    for reason in reasons:
        if reason.startswith(prefix):
            return reason.split(":", 1)[1].strip()
    return None


def indicator_flags(reasons):
    text = " | ".join(reasons).upper()

    return {
        "ema_used": "EMA" in text,
        "rsi_used": "RSI" in text,
        "macd_used": "MACD" in text,
        "adx_used": "ADX" in text,
        "atr_used": "ATR" in text,
    }


def import_history():
    db_path = get_database_path()

    print("=" * 60)
    print("HISTORICAL LEARNING IMPORT")
    print("=" * 60)
    print("DATABASE:", db_path)

    if not db_path.exists():
        print("ERROR: Database not found.")
        return

    source = sqlite3.connect(db_path)
    source.row_factory = sqlite3.Row

    rows = source.execute("""
        SELECT *
        FROM trades
        WHERE result IN ('WIN', 'LOSS', 'DRAW', 'UNRESOLVED')
        ORDER BY entry_time ASC
    """).fetchall()

    print("HISTORICAL TRADES FOUND:", len(rows))

    repo = LearningRepository()

    imported = 0
    skipped = 0

    for row in rows:

        reasons = parse_reasons(row["reasons"])

        entry_time = parse_datetime(row["entry_time"])
        exit_time = parse_datetime(row["exit_time"])

        duration = (exit_time - entry_time).total_seconds()

        if duration < 0:
            duration = 0

        regime = find_reason(reasons, "Regime:") or "UNKNOWN"

        flags = indicator_flags(reasons)

        record = TradeLearning(
            trade_id=row["id"],
            asset=row["asset"] or "UNKNOWN",
            timeframe=row["timeframe"] or "UNKNOWN",
            session=get_session(entry_time),
            action=row["action"] or "WAIT",
            indicator_mode="HISTORICAL",
            regime=regime,
            trend=row["trend"] or "UNKNOWN",
            confidence=float(row["confidence"] or 0),
            probability=float(row["confidence"] or 0),
            risk=row["risk"] or "UNKNOWN",
            grade=row["grade"] or "UNKNOWN",
            # Historical database does not contain
            # exact raw indicator values, so do not invent them.
            ema20=None,
            ema50=None,
            ema200=None,
            rsi=None,
            macd=None,
            signal_line=None,
            histogram=None,
            adx=None,
            atr=None,
            entry_price=float(row["entry_price"] or 0),
            exit_price=float(row["exit_price"] or 0),
            payout=float(row["payout"] or 0),
            profit=float(row["profit"] or 0),
            result=row["result"],
            entry_time=entry_time,
            exit_time=exit_time,
            duration=duration,
            reasons=reasons,
            ema_used=flags["ema_used"],
            rsi_used=flags["rsi_used"],
            macd_used=flags["macd_used"],
            adx_used=flags["adx_used"],
            atr_used=flags["atr_used"],
        )

        try:
            repo.add(record)
            imported += 1
        except Exception as e:
            skipped += 1
            print(f"ERROR importing {row['id']}: {e}")

    print()
    print("=" * 60)
    print("IMPORT COMPLETE")
    print("=" * 60)
    print("IMPORTED:", imported)
    print("SKIPPED:", skipped)
    print("LEARNING TOTAL:", repo.count())

    source.close()


if __name__ == "__main__":
    import_history()
