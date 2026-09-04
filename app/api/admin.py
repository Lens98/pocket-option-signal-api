from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime, timezone
import uuid
from app.api.auth import require_admin
from app.database.database import database
from app.database.trade_repository import TradeRepository
from app.services.performance_analyzer import PerformanceAnalyzer
import hashlib
import secrets


def write_admin_log(
    admin_id,
    action,
    target_type=None,
    target_id=None,
    details=None,
):
    database.execute(
        """
        INSERT INTO admin_logs (
            admin_id,
            action,
            target_type,
            target_id,
            details,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            str(admin_id) if admin_id is not None else None,
            action,
            target_type,
            str(target_id) if target_id is not None else None,
            details,
            datetime.now(timezone.utc).isoformat(),
        ),
    )


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/logs")
def admin_logs(user: dict = Depends(require_admin)):
    rows = database.fetch_all("""
        SELECT
            admin_logs.id,
            admin_logs.admin_id,
            users.email AS admin_email,
            admin_logs.action,
            admin_logs.target_type,
            admin_logs.target_id,
            admin_logs.details,
            admin_logs.created_at
        FROM admin_logs
        LEFT JOIN users
            ON users.id = admin_logs.admin_id
        ORDER BY admin_logs.created_at DESC
        LIMIT 500
    """)

    return {
        "success": True,
        "logs": [dict(row) for row in rows],
        "total": len(rows),
    }


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
        write_admin_log(
            admin_id=user["id"],
            action="delete_user",
            target_type="user",
            target_id=user_id,
            details="Administrator deleted a user account.",
        )

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


# ==========================================
# SUBSCRIPTIONS
# ==========================================


@router.get("/subscriptions")
def admin_get_subscriptions(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            subscriptions.id,
            subscriptions.user_id,
            users.email,
            subscriptions.plan,
            subscriptions.status,
            subscriptions.started_at,
            subscriptions.expires_at,
            subscriptions.created_at,
            subscriptions.updated_at
        FROM subscriptions
        LEFT JOIN users
            ON users.id = subscriptions.user_id
        ORDER BY subscriptions.created_at DESC
    """)

    subscriptions = [dict(row) for row in rows]

    return {
        "success": True,
        "subscriptions": subscriptions,
    }


@router.post("/subscriptions")
def admin_create_subscription(
    payload: dict,
    user: dict = Depends(require_admin),
):
    user_id = payload.get("user_id")
    plan = payload.get("plan", "NONE")
    status = payload.get("status", "active")

    if not user_id:
        raise HTTPException(status_code=400, detail="user_id is required.")

    existing_user = database.fetch_one(
        """
        SELECT id
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found.")

    now = datetime.now(timezone.utc).isoformat()

    subscription_id = str(uuid.uuid4())

    started_at = payload.get("started_at", now)

    expires_at = payload.get("expires_at")

    database.execute(
        """
        INSERT INTO subscriptions (
            id,
            user_id,
            plan,
            status,
            started_at,
            expires_at,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            subscription_id,
            user_id,
            plan,
            status,
            started_at,
            expires_at,
            now,
            now,
        ),
    )
    write_admin_log(
        admin_id=user["id"],
        action="create_subscription",
        target_type="subscription",
        target_id=subscription_id,
        details=f"Created subscription for user {user_id}.",
    )
    return {
        "success": True,
        "subscription": {
            "id": subscription_id,
            "user_id": user_id,
            "plan": plan,
            "status": status,
            "started_at": started_at,
            "expires_at": expires_at,
        },
    }


@router.patch("/subscriptions/{subscription_id}")
def admin_update_subscription(
    subscription_id: str,
    payload: dict,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM subscriptions
        WHERE id = ?
        """,
        (subscription_id,),
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    allowed_fields = {
        "plan",
        "status",
        "started_at",
        "expires_at",
    }

    updates = []
    values = []

    for field in allowed_fields:

        if field in payload:

            updates.append(f"{field} = ?")

            values.append(payload[field])

    if not updates:
        raise HTTPException(status_code=400, detail="No valid fields to update.")

    updates.append("updated_at = ?")

    values.append(datetime.now(timezone.utc).isoformat())

    values.append(subscription_id)

    database.execute(
        f"""
        UPDATE subscriptions
        SET {", ".join(updates)}
        WHERE id = ?
        """,
        tuple(values),
    )
    write_admin_log(
        admin_id=user["id"],
        action="update_subscription",
        target_type="subscription",
        target_id=subscription_id,
        details="Administrator updated a subscription.",
    )
    return {
        "success": True,
        "message": "Subscription updated.",
    }


@router.delete("/subscriptions/{subscription_id}")
def admin_delete_subscription(
    subscription_id: str,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM subscriptions
        WHERE id = ?
        """,
        (subscription_id,),
    )

    if not existing:
        raise HTTPException(status_code=404, detail="Subscription not found.")

    database.execute(
        """
        DELETE FROM subscriptions
        WHERE id = ?
        """,
        (subscription_id,),
    )
    write_admin_log(
        admin_id=user["id"],
        action="delete_subscription",
        target_type="subscription",
        target_id=subscription_id,
        details="Administrator deleted a subscription.",
    )
    return {
        "success": True,
        "message": "Subscription deleted.",
    }


# ==========================================
# COUPONS
# ==========================================


@router.get("/coupons")
def admin_get_coupons(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            id,
            code,
            discount_type,
            discount_value,
            max_uses,
            used_count,
            status,
            expires_at,
            created_at,
            updated_at
        FROM coupons
        ORDER BY created_at DESC
    """)

    coupons = [dict(row) for row in rows]

    return {
        "success": True,
        "coupons": coupons,
        "total": len(coupons),
    }


# ==========================================
# CREATE COUPON
# ==========================================


@router.post("/coupons")
def admin_create_coupon(
    payload: dict,
    user: dict = Depends(require_admin),
):
    code = str(payload.get("code") or "").strip().upper()
    discount_type = str(payload.get("discount_type") or "percent").strip().lower()

    discount_value = payload.get("discount_value", 0)
    max_uses = payload.get("max_uses")
    status = str(payload.get("status") or "active").strip().lower()
    expires_at = payload.get("expires_at")

    if not code:
        raise HTTPException(
            status_code=400,
            detail="Coupon code is required.",
        )

    if discount_type not in ("percent", "fixed"):
        raise HTTPException(
            status_code=400,
            detail="Discount type must be percent or fixed.",
        )

    try:
        discount_value = float(discount_value)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Discount value must be a number.",
        )

    if discount_value < 0:
        raise HTTPException(
            status_code=400,
            detail="Discount value cannot be negative.",
        )

    if discount_type == "percent" and discount_value > 100:
        raise HTTPException(
            status_code=400,
            detail="Percentage discount cannot exceed 100.",
        )

    if max_uses is not None and max_uses != "":
        try:
            max_uses = int(max_uses)
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=400,
                detail="Maximum uses must be a whole number.",
            )

        if max_uses < 1:
            raise HTTPException(
                status_code=400,
                detail="Maximum uses must be at least 1.",
            )
    else:
        max_uses = None

    if status not in ("active", "inactive"):
        raise HTTPException(
            status_code=400,
            detail="Status must be active or inactive.",
        )

    now = datetime.now(timezone.utc).isoformat()
    coupon_id = str(uuid.uuid4())

    try:
        database.execute(
            """
            INSERT INTO coupons (
                id,
                code,
                discount_type,
                discount_value,
                max_uses,
                used_count,
                status,
                expires_at,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)
            """,
            (
                coupon_id,
                code,
                discount_type,
                discount_value,
                max_uses,
                status,
                expires_at,
                now,
                now,
            ),
        )

    except Exception as error:
        if "UNIQUE" in str(error).upper():
            raise HTTPException(
                status_code=409,
                detail="Coupon code already exists.",
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to create coupon.",
        )
    write_admin_log(
        admin_id=user["id"],
        action="create_coupon",
        target_type="coupon",
        target_id=coupon_id,
        details="Administrator created a coupon.",
    )
    return {
        "success": True,
        "message": "Coupon created.",
        "coupon": {
            "id": coupon_id,
            "code": code,
            "discount_type": discount_type,
            "discount_value": discount_value,
            "max_uses": max_uses,
            "used_count": 0,
            "status": status,
            "expires_at": expires_at,
            "created_at": now,
            "updated_at": now,
        },
    }


# ==========================================
# UPDATE COUPON
# ==========================================


@router.patch("/coupons/{coupon_id}")
def admin_update_coupon(
    coupon_id: str,
    payload: dict,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM coupons
        WHERE id = ?
        """,
        (coupon_id,),
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    allowed_fields = {
        "code",
        "discount_type",
        "discount_value",
        "max_uses",
        "status",
        "expires_at",
    }

    updates = []
    values = []

    for field in allowed_fields:

        if field not in payload:
            continue

        value = payload[field]

        if field == "code":
            value = str(value or "").strip().upper()

            if not value:
                raise HTTPException(
                    status_code=400,
                    detail="Coupon code cannot be empty.",
                )

        elif field == "discount_type":
            value = str(value).strip().lower()

            if value not in ("percent", "fixed"):
                raise HTTPException(
                    status_code=400,
                    detail="Discount type must be percent or fixed.",
                )

        elif field == "discount_value":
            try:
                value = float(value)
            except (TypeError, ValueError):
                raise HTTPException(
                    status_code=400,
                    detail="Discount value must be a number.",
                )

            if value < 0:
                raise HTTPException(
                    status_code=400,
                    detail="Discount value cannot be negative.",
                )

        elif field == "max_uses":
            if value in ("", None):
                value = None
            else:
                try:
                    value = int(value)
                except (TypeError, ValueError):
                    raise HTTPException(
                        status_code=400,
                        detail="Maximum uses must be a whole number.",
                    )

        elif field == "status":
            value = str(value).strip().lower()

            if value not in ("active", "inactive"):
                raise HTTPException(
                    status_code=400,
                    detail="Status must be active or inactive.",
                )

        updates.append(f"{field} = ?")
        values.append(value)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No changes provided.",
        )

    updates.append("updated_at = ?")
    values.append(datetime.now(timezone.utc).isoformat())

    values.append(coupon_id)

    try:
        database.execute(
            f"""
            UPDATE coupons
            SET {", ".join(updates)}
            WHERE id = ?
            """,
            tuple(values),
        )

    except Exception as error:
        if "UNIQUE" in str(error).upper():
            raise HTTPException(
                status_code=409,
                detail="Coupon code already exists.",
            )

        raise HTTPException(
            status_code=500,
            detail="Failed to update coupon.",
        )
    write_admin_log(
        admin_id=user["id"],
        action="update_coupon",
        target_type="coupon",
        target_id=coupon_id,
        details="Administrator updated a coupon.",
    )
    return {
        "success": True,
        "message": "Coupon updated.",
    }


# ==========================================
# DELETE COUPON
# ==========================================


@router.delete("/coupons/{coupon_id}")
def admin_delete_coupon(
    coupon_id: str,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM coupons
        WHERE id = ?
        """,
        (coupon_id,),
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Coupon not found.",
        )

    database.execute(
        """
        DELETE FROM coupons
        WHERE id = ?
        """,
        (coupon_id,),
    )
    write_admin_log(
        admin_id=user["id"],
        action="delete_coupon",
        target_type="coupon",
        target_id=coupon_id,
        details="Administrator deleted a coupon.",
    )
    return {
        "success": True,
        "message": "Coupon deleted.",
    }


# ==========================================
# PAYMENTS
# ==========================================


@router.get("/payments")
def admin_get_payments(
    user: dict = Depends(require_admin),
):
    rows = database.fetch_all("""
        SELECT
            payments.id,
            payments.user_id,
            users.email,
            payments.subscription_id,
            payments.amount,
            payments.currency,
            payments.payment_method,
            payments.crypto_currency,
            payments.network,
            payments.transaction_id,
            payments.wallet_address,
            payments.status,
            payments.description,
            payments.paid_at,
            payments.created_at,
            payments.updated_at
        FROM payments
        LEFT JOIN users
            ON users.id = payments.user_id
        ORDER BY payments.created_at DESC
    """)

    payments = [dict(row) for row in rows]

    return {
        "success": True,
        "payments": payments,
        "total": len(payments),
    }


# ==========================================
# CREATE PAYMENT
# ==========================================


@router.post("/payments")
def admin_create_payment(
    payload: dict,
    user: dict = Depends(require_admin),
):
    user_id = payload.get("user_id")
    subscription_id = payload.get("subscription_id")
    amount = payload.get("amount", 0)
    currency = str(payload.get("currency") or "USD").strip().upper()
    payment_method = str(payload.get("payment_method") or "").strip().lower()

    crypto_currency = payload.get("crypto_currency")
    network = payload.get("network")
    transaction_id = payload.get("transaction_id")
    wallet_address = payload.get("wallet_address")
    status = str(payload.get("status") or "pending").strip().lower()
    description = payload.get("description")
    paid_at = payload.get("paid_at")

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="user_id is required.",
        )

    existing_user = database.fetch_one(
        """
        SELECT id
        FROM users
        WHERE id = ?
        """,
        (user_id,),
    )

    if not existing_user:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if subscription_id:
        existing_subscription = database.fetch_one(
            """
            SELECT id
            FROM subscriptions
            WHERE id = ?
            """,
            (subscription_id,),
        )

        if not existing_subscription:
            raise HTTPException(
                status_code=404,
                detail="Subscription not found.",
            )

    allowed_methods = {
        "stripe",
        "paypal",
        "crypto",
        "cash_app",
        "zelle",
    }

    if payment_method not in allowed_methods:
        raise HTTPException(
            status_code=400,
            detail=(
                "Payment method must be stripe, paypal, " "crypto, cash_app, or zelle."
            ),
        )

    try:
        amount = float(amount)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Amount must be a number.",
        )

    if amount < 0:
        raise HTTPException(
            status_code=400,
            detail="Amount cannot be negative.",
        )

    allowed_statuses = {
        "pending",
        "paid",
        "failed",
        "refunded",
    }

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail=("Status must be pending, paid, " "failed, or refunded."),
        )

    if payment_method == "crypto":
        crypto_currency = str(crypto_currency or "").strip().upper()

        network = str(network or "").strip().upper()

        if not crypto_currency:
            raise HTTPException(
                status_code=400,
                detail="Crypto currency is required for crypto payments.",
            )

        if not network:
            raise HTTPException(
                status_code=400,
                detail="Network is required for crypto payments.",
            )
    else:
        crypto_currency = None
        network = None

    now = datetime.now(timezone.utc).isoformat()

    payment_id = str(uuid.uuid4())

    database.execute(
        """
        INSERT INTO payments (
            id,
            user_id,
            subscription_id,
            amount,
            currency,
            payment_method,
            crypto_currency,
            network,
            transaction_id,
            wallet_address,
            status,
            description,
            paid_at,
            created_at,
            updated_at
        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        """,
        (
            payment_id,
            user_id,
            subscription_id,
            amount,
            currency,
            payment_method,
            crypto_currency,
            network,
            transaction_id,
            wallet_address,
            status,
            description,
            paid_at,
            now,
            now,
        ),
    )
    write_admin_log(
        admin_id=user["id"],
        action="create_payment",
        target_type="payment",
        target_id=payment_id,
        details="Administrator created a payment.",
    )
    return {
        "success": True,
        "message": "Payment created.",
        "payment": {
            "id": payment_id,
            "user_id": user_id,
            "subscription_id": subscription_id,
            "amount": amount,
            "currency": currency,
            "payment_method": payment_method,
            "crypto_currency": crypto_currency,
            "network": network,
            "transaction_id": transaction_id,
            "wallet_address": wallet_address,
            "status": status,
            "description": description,
            "paid_at": paid_at,
            "created_at": now,
            "updated_at": now,
        },
    }


# ==========================================
# UPDATE PAYMENT
# ==========================================


@router.patch("/payments/{payment_id}")
def admin_update_payment(
    payment_id: str,
    payload: dict,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM payments
        WHERE id = ?
        """,
        (payment_id,),
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Payment not found.",
        )

    allowed_fields = {
        "subscription_id",
        "amount",
        "currency",
        "payment_method",
        "crypto_currency",
        "network",
        "transaction_id",
        "wallet_address",
        "status",
        "description",
        "paid_at",
    }

    updates = []
    values = []

    for field in allowed_fields:

        if field not in payload:
            continue

        value = payload[field]

        if field == "amount":
            try:
                value = float(value)
            except (TypeError, ValueError):
                raise HTTPException(
                    status_code=400,
                    detail="Amount must be a number.",
                )

            if value < 0:
                raise HTTPException(
                    status_code=400,
                    detail="Amount cannot be negative.",
                )

        elif field == "currency":
            value = str(value or "USD").strip().upper()

        elif field == "payment_method":
            value = str(value or "").strip().lower()

            if value not in {
                "stripe",
                "paypal",
                "crypto",
                "cash_app",
                "zelle",
            }:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid payment method.",
                )

        elif field == "status":
            value = str(value or "").strip().lower()

            if value not in {
                "pending",
                "paid",
                "failed",
                "refunded",
            }:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid payment status.",
                )

        elif field == "crypto_currency":
            value = str(value).strip().upper() if value not in (None, "") else None

        elif field == "network":
            value = str(value).strip().upper() if value not in (None, "") else None

        updates.append(f"{field} = ?")
        values.append(value)

    if not updates:
        raise HTTPException(
            status_code=400,
            detail="No changes provided.",
        )

    updates.append("updated_at = ?")
    values.append(datetime.now(timezone.utc).isoformat())

    values.append(payment_id)

    database.execute(
        f"""
        UPDATE payments
        SET {", ".join(updates)}
        WHERE id = ?
        """,
        tuple(values),
    )
    write_admin_log(
        admin_id=user["id"],
        action="update_payment",
        target_type="payment",
        target_id=payment_id,
        details="Administrator updated a payment.",
    )
    return {
        "success": True,
        "message": "Payment updated.",
    }


# ==========================================
# DELETE PAYMENT
# ==========================================


@router.delete("/payments/{payment_id}")
def admin_delete_payment(
    payment_id: str,
    user: dict = Depends(require_admin),
):
    existing = database.fetch_one(
        """
        SELECT id
        FROM payments
        WHERE id = ?
        """,
        (payment_id,),
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Payment not found.",
        )

    database.execute(
        """
        DELETE FROM payments
        WHERE id = ?
        """,
        (payment_id,),
    )
    write_admin_log(
        admin_id=user["id"],
        action="delete_payment",
        target_type="payment",
        target_id=payment_id,
        details="Administrator deleted a payment.",
    )
    return {
        "success": True,
        "message": "Payment deleted.",
    }


@router.get("/settings")
def get_admin_settings(user: dict = Depends(require_admin)):
    row = database.fetch_one("""
        SELECT
            id,
            app_name,
            maintenance_mode,
            allow_registrations,
            enable_signals,
            default_timeframe,
            minimum_confidence,
            minimum_agreement,
            updated_at
        FROM admin_settings
        WHERE id = 1
    """)

    if not row:
        raise HTTPException(status_code=404, detail="Admin settings not found")

    return {"success": True, "settings": dict(row)}


@router.patch("/settings")
def update_admin_settings(settings: dict, user: dict = Depends(require_admin)):
    current = database.fetch_one("SELECT * FROM admin_settings WHERE id = 1")

    if not current:
        raise HTTPException(status_code=404, detail="Admin settings not found")

    allowed_fields = {
        "app_name",
        "maintenance_mode",
        "allow_registrations",
        "enable_signals",
        "default_timeframe",
        "minimum_confidence",
        "minimum_agreement",
    }

    updates = {key: value for key, value in settings.items() if key in allowed_fields}

    if not updates:
        return {"success": True, "settings": dict(current)}

    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    set_clause = ", ".join(f"{key} = ?" for key in updates)
    values = list(updates.values())

    database.execute(f"UPDATE admin_settings SET {set_clause} WHERE id = 1", values)

    updated = database.fetch_one("SELECT * FROM admin_settings WHERE id = 1")
    write_admin_log(
        admin_id=user["id"],
        action="update_settings",
        target_type="settings",
        target_id="admin_settings",
        details="Administrator updated admin settings.",
    )

    return {"success": True, "settings": dict(updated)}


# ==========================================
# API KEYS
# ==========================================


@router.get("/api-keys")
def get_api_keys(user: dict = Depends(require_admin)):

    rows = database.fetch_all("""
        SELECT
            api_keys.id,
            api_keys.user_id,
            users.email AS user_email,
            api_keys.name,
            api_keys.status,
            api_keys.created_at,
            api_keys.last_used_at,
            api_keys.expires_at
        FROM api_keys
        LEFT JOIN users
            ON users.id = api_keys.user_id
        ORDER BY api_keys.created_at DESC
    """)

    return {
        "success": True,
        "api_keys": [dict(row) for row in rows],
        "total": len(rows),
    }


# ==========================================
# API KEYS
# ==========================================


@router.get("/api-keys")
def get_api_keys(user: dict = Depends(require_admin)):

    rows = database.fetch_all("""
        SELECT
            api_keys.id,
            api_keys.user_id,
            users.email AS user_email,
            api_keys.name,
            api_keys.status,
            api_keys.created_at,
            api_keys.last_used_at,
            api_keys.expires_at
        FROM api_keys
        LEFT JOIN users
            ON users.id = api_keys.user_id
        ORDER BY api_keys.created_at DESC
    """)

    return {
        "success": True,
        "api_keys": [dict(row) for row in rows],
        "total": len(rows),
    }
