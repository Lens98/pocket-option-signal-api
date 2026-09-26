import os
import uuid
import base64
from datetime import datetime, timezone, timedelta

import requests
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.database.database import database
from app.services.auth_dependency import get_current_user


router = APIRouter(prefix="/payments", tags=["Payments"])


PAYPAL_PLAN_PRICES = {
    "pro": 39.99,
    "elite": 79.99,
    "lifetime": 4000.00,
}


class PaymentSubmission(BaseModel):
    plan: str
    amount: float
    payment_method: str
    transaction_id: str
    crypto_currency: str | None = None
    network: str | None = None
    wallet_address: str | None = None


class PayPalCreateOrder(BaseModel):
    plan: str


class PayPalCaptureOrder(BaseModel):
    order_id: str


def _paypal_base_url() -> str:
    mode = os.getenv("PAYPAL_MODE", "sandbox").strip().lower()

    if mode == "live":
        return "https://api-m.paypal.com"

    return "https://api-m.sandbox.paypal.com"


def _paypal_credentials():
    client_id = os.getenv("PAYPAL_CLIENT_ID", "").strip()
    client_secret = os.getenv("PAYPAL_CLIENT_SECRET", "").strip()

    if not client_id or not client_secret:
        raise HTTPException(
            status_code=503,
            detail="PayPal is not configured on the server.",
        )

    return client_id, client_secret


def _paypal_access_token() -> str:
    client_id, client_secret = _paypal_credentials()

    credentials = f"{client_id}:{client_secret}".encode("utf-8")
    encoded_credentials = base64.b64encode(credentials).decode("utf-8")

    try:
        response = requests.post(
            f"{_paypal_base_url()}/v1/oauth2/token",
            headers={
                "Accept": "application/json",
                "Accept-Language": "en_US",
                "Authorization": f"Basic {encoded_credentials}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data="grant_type=client_credentials",
            timeout=20,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="Unable to connect to PayPal.",
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail="PayPal authentication failed.",
        )

    data = response.json()
    access_token = data.get("access_token")

    if not access_token:
        raise HTTPException(
            status_code=502,
            detail="PayPal did not return an access token.",
        )

    return access_token


def _paypal_request(
    method: str,
    path: str,
    payload: dict | None = None,
):
    access_token = _paypal_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        response = requests.request(
            method=method,
            url=f"{_paypal_base_url()}{path}",
            headers=headers,
            json=payload,
            timeout=30,
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=502,
            detail="Unable to connect to PayPal.",
        )

    try:
        data = response.json()
    except ValueError:
        data = {}

    if response.status_code >= 400:
        detail = data.get("message") or data.get("error_description")

        raise HTTPException(
            status_code=502,
            detail=detail or "PayPal request failed.",
        )

    return data


def _get_current_subscription(user_id: str):
    return database.fetch_one(
        """
        SELECT
            id,
            plan,
            status,
            started_at,
            expires_at
        FROM subscriptions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user_id,),
    )


def _activate_subscription(user_id: str, plan: str):
    now = datetime.now(timezone.utc)
    now_iso = now.isoformat()

    if plan == "lifetime":
        expires_at = None
    elif plan in {"pro", "elite"}:
        expires_at = (now + timedelta(days=30)).isoformat()
    else:
        raise ValueError(f"Unsupported paid plan: {plan}")

    subscription = _get_current_subscription(user_id)

    if subscription:
        database.execute(
            """
            UPDATE subscriptions
            SET
                plan = ?,
                status = 'active',
                started_at = ?,
                expires_at = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                plan,
                now_iso,
                expires_at,
                now_iso,
                subscription["id"],
            ),
        )

        return subscription["id"]

    subscription_id = str(uuid.uuid4())

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
        VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
        """,
        (
            subscription_id,
            user_id,
            plan,
            now_iso,
            expires_at,
            now_iso,
            now_iso,
        ),
    )

    return subscription_id


@router.get("/plans")
def get_plans():
    return {
        "plans": [
            {
                "id": "free",
                "name": "Free",
                "price": 0,
                "duration_days": 0,
                "trade_limit": 3,
                "trade_limit_type": "total",
            },
            {
                "id": "pro",
                "name": "Pro",
                "price": 39.99,
                "duration_days": 30,
                "trade_limit": 20,
                "trade_limit_type": "daily",
            },
            {
                "id": "elite",
                "name": "Elite",
                "price": 79.99,
                "duration_days": 30,
                "trade_limit": None,
                "trade_limit_type": "unlimited",
            },
            {
                "id": "lifetime",
                "name": "Lifetime",
                "price": 4000.00,
                "duration_days": None,
                "trade_limit": None,
                "trade_limit_type": "unlimited",
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

    subscription = database.fetch_one(
        """
        SELECT id
        FROM subscriptions
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 1
        """,
        (user["id"],),
    )

    subscription_id = subscription["id"] if subscription else None

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
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payment_id,
            user["id"],
            subscription_id,
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


@router.post("/paypal/create-order")
def paypal_create_order(
    payment: PayPalCreateOrder,
    user: dict = Depends(get_current_user),
):
    plan = payment.plan.strip().lower()

    if plan not in PAYPAL_PLAN_PRICES:
        raise HTTPException(
            status_code=400,
            detail="Invalid PayPal plan.",
        )

    amount = PAYPAL_PLAN_PRICES[plan]
    payment_id = str(uuid.uuid4())

    order_payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": payment_id,
                "custom_id": payment_id,
                "description": f"SignalForge AI {plan.title()} subscription",
                "amount": {
                    "currency_code": "USD",
                    "value": f"{amount:.2f}",
                },
            }
        ],
        "application_context": {
            "brand_name": "SignalForge AI",
            "user_action": "PAY_NOW",
            "shipping_preference": "NO_SHIPPING",
        },
    }

    paypal_order = _paypal_request(
        "POST",
        "/v2/checkout/orders",
        order_payload,
    )

    order_id = paypal_order.get("id")

    if not order_id:
        raise HTTPException(
            status_code=502,
            detail="PayPal did not return an order ID.",
        )

    now = datetime.now(timezone.utc).isoformat()

    subscription = _get_current_subscription(user["id"])
    subscription_id = subscription["id"] if subscription else None

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
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payment_id,
            user["id"],
            subscription_id,
            amount,
            "USD",
            "paypal",
            None,
            None,
            order_id,
            None,
            "pending",
            f"{plan} subscription",
            now,
            now,
        ),
    )

    return {
        "order_id": order_id,
        "payment_id": payment_id,
        "plan": plan,
        "amount": amount,
        "currency": "USD",
    }


@router.post("/paypal/capture-order")
def paypal_capture_order(
    payment: PayPalCaptureOrder,
    user: dict = Depends(get_current_user),
):
    order_id = payment.order_id.strip()

    if not order_id:
        raise HTTPException(
            status_code=400,
            detail="PayPal order ID is required.",
        )

    local_payment = database.fetch_one(
        """
        SELECT
            id,
            user_id,
            subscription_id,
            amount,
            currency,
            payment_method,
            transaction_id,
            status,
            description
        FROM payments
        WHERE transaction_id = ?
          AND user_id = ?
          AND payment_method = 'paypal'
        LIMIT 1
        """,
        (order_id, user["id"]),
    )

    if not local_payment:
        raise HTTPException(
            status_code=404,
            detail="PayPal payment was not found.",
        )

    if local_payment["status"] == "paid":
        return {
            "message": "Payment was already completed.",
            "status": "paid",
            "order_id": order_id,
        }

    description = (local_payment["description"] or "").lower()

    if description.startswith("pro "):
        plan = "pro"
    elif description.startswith("elite "):
        plan = "elite"
    elif description.startswith("lifetime "):
        plan = "lifetime"
    else:
        raise HTTPException(
            status_code=400,
            detail="Unable to determine the subscription plan.",
        )

    expected_amount = PAYPAL_PLAN_PRICES[plan]

    order = _paypal_request(
        "GET",
        f"/v2/checkout/orders/{order_id}",
    )

    order_status = order.get("status")

    if order_status == "COMPLETED":
        capture_status = "COMPLETED"
        capture_amount = None
        capture_currency = None

        try:
            purchase_unit = order["purchase_units"][0]
            captures = purchase_unit["payments"]["captures"]

            if captures:
                capture = captures[0]
                capture_status = capture.get("status")
                capture_amount = capture.get("amount", {}).get("value")
                capture_currency = capture.get("amount", {}).get(
                    "currency_code"
                )
        except (KeyError, IndexError, TypeError):
            pass

        if capture_status != "COMPLETED":
            raise HTTPException(
                status_code=400,
                detail="PayPal order is not successfully captured.",
            )

        if capture_currency != "USD":
            raise HTTPException(
                status_code=400,
                detail="PayPal payment currency is invalid.",
            )

        if capture_amount is not None:
            if float(capture_amount) != expected_amount:
                raise HTTPException(
                    status_code=400,
                    detail="PayPal payment amount does not match the selected plan.",
                )

        now = datetime.now(timezone.utc).isoformat()

        database.execute(
            """
            UPDATE payments
            SET
                status = 'paid',
                updated_at = ?
            WHERE id = ?
            """,
            (now, local_payment["id"]),
        )

        subscription_id = _activate_subscription(
            user["id"],
            plan,
        )

        database.execute(
            """
            UPDATE payments
            SET
                subscription_id = ?,
                updated_at = ?
            WHERE id = ?
            """,
            (
                subscription_id,
                now,
                local_payment["id"],
            ),
        )

        return {
            "message": "PayPal payment completed successfully.",
            "status": "paid",
            "order_id": order_id,
            "plan": plan,
        }

    if order_status not in {"CREATED", "SAVED", "APPROVED"}:
        raise HTTPException(
            status_code=400,
            detail=f"PayPal order cannot be captured. Current status: {order_status}.",
        )

    captured = _paypal_request(
        "POST",
        f"/v2/checkout/orders/{order_id}/capture",
        {},
    )

    capture_status = None
    capture_amount = None
    capture_currency = None

    try:
        capture = (
            captured["purchase_units"][0]
            ["payments"]["captures"][0]
        )

        capture_status = capture.get("status")
        capture_amount = capture.get("amount", {}).get("value")
        capture_currency = capture.get("amount", {}).get(
            "currency_code"
        )
    except (KeyError, IndexError, TypeError):
        pass

    if capture_status != "COMPLETED":
        raise HTTPException(
            status_code=400,
            detail="PayPal payment was not completed.",
        )

    if capture_currency != "USD":
        raise HTTPException(
            status_code=400,
            detail="PayPal payment currency is invalid.",
        )

    if capture_amount is None:
        raise HTTPException(
            status_code=400,
            detail="PayPal did not return a payment amount.",
        )

    if float(capture_amount) != expected_amount:
        raise HTTPException(
            status_code=400,
            detail="PayPal payment amount does not match the selected plan.",
        )

    now = datetime.now(timezone.utc).isoformat()

    database.execute(
        """
        UPDATE payments
        SET
            status = 'paid',
            updated_at = ?
        WHERE id = ?
        """,
        (now, local_payment["id"]),
    )

    subscription_id = _activate_subscription(
        user["id"],
        plan,
    )

    database.execute(
        """
        UPDATE payments
        SET
            subscription_id = ?,
            updated_at = ?
        WHERE id = ?
        """,
        (
            subscription_id,
            now,
            local_payment["id"],
        ),
    )

    return {
        "message": "PayPal payment completed successfully.",
        "status": "paid",
        "order_id": order_id,
        "plan": plan,
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