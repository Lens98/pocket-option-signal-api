from fastapi import APIRouter, Depends, HTTPException

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
# PERFORMANCE SUMMARY
# ==========================================


@router.get("/performance/summary")
def admin_performance_summary(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            result,
            profit,
            confidence,
            probability,
            agreement_score
        FROM trades
    """)

    total_trades = len(rows)

    wins = sum(1 for row in rows if str(row["result"] or "").upper() == "WIN")

    losses = sum(1 for row in rows if str(row["result"] or "").upper() == "LOSS")

    draws = sum(1 for row in rows if str(row["result"] or "").upper() == "DRAW")

    completed = wins + losses

    win_rate = round((wins / completed) * 100, 2) if completed else 0

    profits = [
        float(row["profit"] or 0) for row in rows if float(row["profit"] or 0) > 0
    ]

    losses_amounts = [
        float(row["profit"] or 0) for row in rows if float(row["profit"] or 0) < 0
    ]

    total_profit = sum(profits)

    total_loss = abs(sum(losses_amounts))

    net_profit = total_profit - total_loss

    confidence_values = [
        float(row["confidence"]) for row in rows if row["confidence"] is not None
    ]

    probability_values = [
        float(row["probability"]) for row in rows if row["probability"] is not None
    ]

    agreement_values = [
        float(row["agreement_score"])
        for row in rows
        if row["agreement_score"] is not None
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
        "statistics": {
            "total_trades": total_trades,
            "wins": wins,
            "losses": losses,
            "draws": draws,
            "win_rate": win_rate,
            "total_profit": round(
                total_profit,
                2,
            ),
            "total_loss": round(
                total_loss,
                2,
            ),
            "net_profit": round(
                net_profit,
                2,
            ),
            "average_confidence": average_confidence,
            "average_probability": average_probability,
            "average_agreement": average_agreement,
        },
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


# ==========================================
# DELETE USER
# ==========================================


@router.delete("/users/{user_id}")
def admin_delete_user(
    user_id: str,
    user: dict = Depends(require_admin),
):
    # Get the user
    user_row = database.fetch_one(
        """
        SELECT id, email, role
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    if not user_row:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    # Never allow an admin account to be deleted
    if user_row["role"] == "admin":
        raise HTTPException(
            status_code=403,
            detail="Administrator accounts cannot be deleted.",
        )

    # Never allow the currently logged-in admin to delete itself
    if str(user.get("id")) == str(user_id):
        raise HTTPException(
            status_code=403,
            detail="You cannot delete your own account.",
        )

    connection = database.connection

    try:
        cursor = connection.cursor()

        # Delete user's trading history
        cursor.execute(
            "DELETE FROM trades WHERE user_id = ?",
            (user_id,),
        )

        # Delete user's sessions
        cursor.execute(
            "DELETE FROM sessions WHERE user_id = ?",
            (user_id,),
        )

        # Delete user's preferences
        cursor.execute(
            "DELETE FROM user_preferences WHERE user_id = ?",
            (user_id,),
        )

        # Delete the user
        cursor.execute(
            "DELETE FROM users WHERE id = ?",
            (user_id,),
        )

        if cursor.rowcount != 1:
            raise Exception("User deletion failed.")

        connection.commit()

        return {
            "success": True,
            "message": "User deleted successfully.",
            "user_id": user_id,
        }

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete user.",
        ) from error
