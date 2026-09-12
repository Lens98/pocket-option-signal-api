import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database.database import database
from app.services.auth_dependency import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentSubmission(BaseModel):
    plan: str
    amount: float
    payment_method: str
    transaction_id: str
    crypto_currency: str | None = None
    network: str | None = None
    wallet_address: str | None = None


@router.get("/plans")
def get_plans():
    return {
        "plans": [
            {
                "id": "monthly",
                "name": "Monthly",
                "price": 29.99,
                "duration_days": 30,
            },
            {
                "id": "quarterly",
                "name": "Quarterly",
                "price": 79.99,
                "duration_days": 90,
            },
            {
                "id": "yearly",
                "name": "Yearly",
                "price": 249.99,
                "duration_days": 365,
            },
        ]
    }


@router.post("/submit")
def submit_payment(
    payment: PaymentSubmission,
    user: dict = Depends(get_current_user),
):
    if payment.amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="Payment amount must be greater than zero.",
        )

    if not payment.transaction_id.strip():
        raise HTTPException(
            status_code=400,
            detail="Transaction ID is required.",
        )

    existing_payment = database.fetch_one(
        """
        SELECT id
        FROM payments
        WHERE transaction_id = ?
        LIMIT 1
        """,
        (payment.transaction_id.strip(),),
    )

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="This transaction has already been submitted.",
        )

    payment_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    database.execute(
        """
        INSERT INTO payments (
            id,
            user_id,
            amount,
            currency,
            payment_method,
            crypto_currency,
            network,
            transaction_id,
            wallet_address,
            status,
            description,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payment_id,
            user["id"],
            payment.amount,
            "USD",
            payment.payment_method,
            payment.crypto_currency,
            payment.network,
            payment.transaction_id.strip(),
            payment.wallet_address,
            "pending",
            f"{payment.plan} subscription",
            now,
            now,
        ),
    )

    return {
        "message": "Payment submitted successfully. Waiting for admin approval.",
        "payment_id": payment_id,
        "status": "pending",
    }


@router.get("/status")
def get_payment_status(
    user: dict = Depends(get_current_user),
):
    payment = database.fetch_one(
        """
        SELECT
            id,
            amount,
            currency,
            payment_method,
            crypto_currency,
            network,
            transaction_id,
            wallet_address,
            status,
            description,
            created_at,
            updated_at
        FROM payments
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user["id"],),
    )

    subscription = database.fetch_one(
        """
        SELECT
            id,
            plan,
            status,
            started_at,
            expires_at,
            created_at,
            updated_at
        FROM subscriptions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user["id"],),
    )

    return {
        "payment": dict(payment) if payment else None,
        "subscription": dict(subscription) if subscription else None,
    }
