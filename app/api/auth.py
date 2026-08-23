from fastapi import APIRouter, HTTPException, Header, Depends

from pydantic import BaseModel, EmailStr

from app.services.auth_service import (
    create_user,
    authenticate_user,
    create_session,
    get_user_from_token,
    delete_session,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ==========================================
# AUTHENTICATION DEPENDENCY
# ==========================================


def get_authenticated_user(authorization: str | None = Header(default=None)):

    if not authorization:

        raise HTTPException(status_code=401, detail="Authentication required.")

    if not authorization.startswith("Bearer "):

        raise HTTPException(status_code=401, detail="Invalid authorization header.")

    token = authorization[7:]

    user = get_user_from_token(token)

    if not user:

        raise HTTPException(status_code=401, detail="Invalid or expired session.")

    return user


# ==========================================
# REQUEST MODELS
# ==========================================


class RegisterRequest(BaseModel):

    email: EmailStr

    password: str


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


# ==========================================
# REGISTER
# ==========================================


@router.post("/register")
def register(request: RegisterRequest):

    if len(request.password) < 8:

        raise HTTPException(
            status_code=400, detail="Password must be at least 8 characters."
        )

    try:

        user = create_user(request.email, request.password)

    except ValueError as error:

        raise HTTPException(status_code=409, detail=str(error))

    return {
        "success": True,
        "message": "Account created successfully.",
        "user": {"id": user["id"], "email": user["email"]},
    }


# ==========================================
# LOGIN
# ==========================================


@router.post("/login")
def login(request: LoginRequest):

    user = authenticate_user(request.email, request.password)

    if not user:

        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token, expires_at = create_session(user["id"])

    return {
        "success": True,
        "token": token,
        "expires_at": expires_at.isoformat(),
        "user": {"id": user["id"], "email": user["email"]},
    }


# ==========================================
# CURRENT USER
# ==========================================


@router.get("/me")
def get_current_user(user: dict = Depends(get_authenticated_user)):

    return {"authenticated": True, "user": user}


# ==========================================
# LOGOUT
# ==========================================


@router.post("/logout")
def logout(authorization: str | None = Header(default=None)):

    if authorization and authorization.startswith("Bearer "):

        token = authorization[7:]

        delete_session(token)

    return {"success": True, "message": "Logged out successfully."}
