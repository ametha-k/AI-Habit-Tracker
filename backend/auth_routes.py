# auth_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict

router = APIRouter()

# Simulated user database (for testing only)
fake_users: Dict[str, str] = {}  # {email: password}


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/signup")
def signup(data: SignupRequest):
    if data.email in fake_users:
        raise HTTPException(status_code=400, detail="Email already exists")
    fake_users[data.email] = data.password
    return {"success": True, "message": "User registered successfully"}


@router.post("/auth/login")
def login(data: LoginRequest):
    if fake_users.get(data.email) != data.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"success": True, "message": "Login successful"}