from fastapi import APIRouter, Depends

from app.api.auth import require_admin
from app.database.database import database
from app.database.trade_repository import TradeRepository
from app.services.performance_analyzer import PerformanceAnalyzer

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

trade_repository = TradeRepository()
performance_analyzer = PerformanceAnalyzer()


# ==========================================
# ADMIN STATS
# ==========================================


@router.get("/stats")
def admin_stats(
    user: dict = Depends(require_admin),
):
    total_users = database.fetch_one("SELECT COUNT(*) AS total FROM users")["total"]

    total_trades = trade_repository.count()
    wins = trade_repository.win_count()
    losses = trade_repository.loss_count()
    draws = trade_repository.draw_count()
    win_rate = trade_repository.win_rate()

    statistics = trade_repository.statistics()

    return {
        "success": True,
        "users": total_users,
        "trades": total_trades,
        "wins": wins,
        "losses": losses,
        "draws": draws,
        "win_rate": win_rate,
        "profit": statistics["profit"],
    }


# ==========================================
# ALL USERS
# ==========================================


@router.get("/users")
def admin_users(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            id,
            email,
            role,
            created_at
        FROM users
        ORDER BY created_at DESC
        """)

    users = []

    for row in rows:
        users.append(
            {
                "id": row["id"],
                "email": row["email"],
                "role": row["role"],
                "created_at": row["created_at"],
            }
        )

    return {
        "success": True,
        "users": users,
        "total": len(users),
    }


# ==========================================
# ALL TRADES
# ==========================================


@router.get("/trades")
def admin_trades(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            id,
            user_id,
            asset,
            timeframe,
            action,
            confidence,
            probability,
            agreement_score,
            session,
            regime,
            indicator_mode,
            pattern,
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
            payout
        FROM trades
        ORDER BY entry_time DESC
        """)

    trades = []

    for row in rows:
        trades.append(
            {
                "id": row["id"],
                "user_id": row["user_id"],
                "asset": row["asset"],
                "timeframe": row["timeframe"],
                "action": row["action"],
                "confidence": row["confidence"],
                "probability": row["probability"],
                "agreement_score": row["agreement_score"],
                "session": row["session"],
                "regime": row["regime"],
                "indicator_mode": row["indicator_mode"],
                "pattern": row["pattern"],
                "grade": row["grade"],
                "risk": row["risk"],
                "trend": row["trend"],
                "entry_price": row["entry_price"],
                "exit_price": row["exit_price"],
                "entry_time": row["entry_time"],
                "exit_time": row["exit_time"],
                "expiration_seconds": row["expiration_seconds"],
                "status": row["status"],
                "result": row["result"],
                "profit": row["profit"],
                "payout": row["payout"],
            }
        )

    return {
        "success": True,
        "trades": trades,
        "total": len(trades),
    }


# ==========================================
# PERFORMANCE
# ==========================================


@router.get("/performance")
def admin_performance(
    user: dict = Depends(require_admin),
):
    report = performance_analyzer.full_report()

    return {
        "success": True,
        "performance": report,
    }
