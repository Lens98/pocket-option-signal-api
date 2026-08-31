import hashlib
import secrets
import uuid

from datetime import datetime, timedelta, timezone

from app.database.database import database

# ==========================================
# PASSWORD HASHING
# ==========================================


def hash_password(password: str) -> str:

    salt = secrets.token_bytes(32)

    password_hash = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, 600_000
    )

    return salt.hex() + ":" + password_hash.hex()


def verify_password(password: str, stored_hash: str) -> bool:

    try:

        salt_hex, hash_hex = stored_hash.split(":")

        salt = bytes.fromhex(salt_hex)

        expected_hash = bytes.fromhex(hash_hex)

        actual_hash = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt, 600_000
        )

        return secrets.compare_digest(actual_hash, expected_hash)

    except (ValueError, TypeError):

        return False


# ==========================================
# CREATE USER
# ==========================================


def create_user(email: str, password: str):

    email = email.strip().lower()

    existing_user = database.fetch_one(
        """
        SELECT id
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    if existing_user:

        raise ValueError("An account with this email already exists.")

    user_id = str(uuid.uuid4())

    password_hash = hash_password(password)

    created_at = datetime.now(timezone.utc).isoformat()

    database.execute(
        """
        INSERT INTO users (
            id,
            email,
            password_hash,
            role,
            created_at
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            email,
            password_hash,
            "user",
            created_at,
        ),
    )

    return {
        "id": user_id,
        "email": email,
        "role": "user",
        "created_at": created_at,
    }


# ==========================================
# LOGIN
# ==========================================


def authenticate_user(email: str, password: str):

    email = email.strip().lower()

    user = database.fetch_one(
        """
        SELECT
            id,
            email,
            password_hash,
            role,
            created_at
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    if not user:

        return None

    if not verify_password(password, user["password_hash"]):

        return None

    return user


# ==========================================
# CREATE SESSION
# ==========================================


def create_session(user_id: str):

    token = secrets.token_urlsafe(64)

    created_at = datetime.now(timezone.utc)

    expires_at = created_at + timedelta(days=30)

    database.execute(
        """
        INSERT INTO sessions (
            token,
            user_id,
            created_at,
            expires_at
        )
        VALUES (?, ?, ?, ?)
        """,
        (token, user_id, created_at.isoformat(), expires_at.isoformat()),
    )

    return token, expires_at


# ==========================================
# GET USER FROM SESSION
# ==========================================


def get_user_from_token(token: str):

    if not token:
        return None

    session = database.fetch_one(
        """
        SELECT
            sessions.user_id,
            sessions.expires_at,
            users.id,
            users.email,
            users.role,
            users.created_at
        FROM sessions

        INNER JOIN users
            ON users.id = sessions.user_id

        WHERE sessions.token = ?
        """,
        (token,),
    )

    if not session:
        return None

    try:

        expires_at_value = session["expires_at"]

        if not expires_at_value:
            return None

        expires_at = datetime.fromisoformat(expires_at_value)

        # Support old timezone-naive session timestamps
        if expires_at.tzinfo is None:

            expires_at = expires_at.replace(tzinfo=timezone.utc)

    except (ValueError, TypeError):

        return None

    now = datetime.now(timezone.utc)

    if expires_at <= now:

        database.execute(
            """
            DELETE FROM sessions
            WHERE token = ?
            """,
            (token,),
        )

        return None

    return {
        "id": session["id"],
        "email": session["email"],
        "role": session["role"],
        "created_at": session["created_at"],
    }


# ==========================================
# PROMOTE USER TO ADMIN
# ==========================================


def promote_user_to_admin(email: str):

    email = email.strip().lower()

    user = database.fetch_one(
        """
        SELECT
            id,
            email,
            role
        FROM users
        WHERE email = ?
        """,
        (email,),
    )

    if not user:

        raise ValueError("User account not found.")

    database.execute(
        """
        UPDATE users
        SET role = 'admin'
        WHERE email = ?
        """,
        (email,),
    )

    return {
        "id": user["id"],
        "email": user["email"],
        "role": "admin",
    }


# ==========================================
# LOGOUT
# ==========================================


def delete_session(token: str):

    database.execute(
        """
        DELETE FROM sessions
        WHERE token = ?
        """,
        (token,),
    )
