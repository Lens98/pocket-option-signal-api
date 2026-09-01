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


# ==========================================
# USER PERFORMANCE
# ==========================================


@router.get("/users/{user_id}/performance")
def admin_user_performance(
    user_id: str,
    user: dict = Depends(require_admin),
):

    # Verify user exists
    user_row = database.fetch_one(
        """
        SELECT
            id,
            email,
            role,
            created_at
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    if not user_row:
        from fastapi import HTTPException

        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    # Get this user's real trades
    rows = database.fetch_all(
        """
        SELECT
            id,
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
        WHERE user_id = ?
        ORDER BY entry_time DESC
        """,
        (user_id,),
    )

    trades = []

    for row in rows:
        trades.append(
            {
                "id": row["id"],
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

    # --------------------------------------
    # REAL STATISTICS
    # --------------------------------------

    total = len(trades)

    wins = sum(1 for trade in trades if str(trade["result"] or "").upper() == "WIN")

    losses = sum(1 for trade in trades if str(trade["result"] or "").upper() == "LOSS")

    draws = sum(1 for trade in trades if str(trade["result"] or "").upper() == "DRAW")

    completed = wins + losses

    win_rate = round((wins / completed) * 100, 2) if completed else 0

    total_profit = sum(
        float(trade["profit"] or 0)
        for trade in trades
        if float(trade["profit"] or 0) > 0
    )

    total_loss = abs(
        sum(
            float(trade["profit"] or 0)
            for trade in trades
            if float(trade["profit"] or 0) < 0
        )
    )

    net_profit = total_profit - total_loss

    confidence_values = [
        float(trade["confidence"])
        for trade in trades
        if trade["confidence"] is not None
    ]

    probability_values = [
        float(trade["probability"])
        for trade in trades
        if trade["probability"] is not None
    ]

    agreement_values = [
        float(trade["agreement_score"])
        for trade in trades
        if trade["agreement_score"] is not None
    ]

    average_confidence = (
        round(
            sum(confidence_values) / len(confidence_values),
            2,
        )
        if confidence_values
        else 0
    )

    average_probability = (
        round(
            sum(probability_values) / len(probability_values),
            2,
        )
        if probability_values
        else 0
    )

    average_agreement = (
        round(
            sum(agreement_values) / len(agreement_values),
            2,
        )
        if agreement_values
        else 0
    )

    return {
        "success": True,
        "user": {
            "id": user_row["id"],
            "email": user_row["email"],
            "role": user_row["role"],
            "created_at": user_row["created_at"],
        },
        "statistics": {
            "total_trades": total,
            "wins": wins,
            "losses": losses,
            "draws": draws,
            "win_rate": win_rate,
            "total_profit": round(total_profit, 2),
            "total_loss": round(total_loss, 2),
            "net_profit": round(net_profit, 2),
            "average_confidence": average_confidence,
            "average_probability": average_probability,
            "average_agreement": average_agreement,
        },
        "trades": trades,
    }
