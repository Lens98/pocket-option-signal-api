from datetime import datetime, timezone

from fastapi import Depends, Header, HTTPException

from app.database.database import database
from app.services.auth_service import get_user_from_token


def get_current_user(authorization: str | None = Header(default=None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication required.")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header.")

    token = authorization[7:].strip()

    if not token:
        raise HTTPException(status_code=401, detail="Invalid session token.")

    user = get_user_from_token(token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    return user


def require_active_subscription(user: dict = Depends(get_current_user)):
    # Admins can access the system without a paid subscription.
    if user.get("role") == "admin":
        return user

    subscription = database.fetch_one(
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
        (user["id"],),
    )

    if not subscription:
        raise HTTPException(
            status_code=403, detail="An active subscription is required."
        )

    if subscription["status"] != "active":
        raise HTTPException(status_code=403, detail="Your subscription is not active.")

    expires_at_value = subscription["expires_at"]

    if expires_at_value:
        try:
            expires_at = datetime.fromisoformat(expires_at_value)

            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)

            if expires_at <= datetime.now(timezone.utc):
                raise HTTPException(
                    status_code=403, detail="Your subscription has expired."
                )

        except HTTPException:
            raise

        except (ValueError, TypeError):
            raise HTTPException(
                status_code=403, detail="Your subscription expiration date is invalid."
            )

    return user
