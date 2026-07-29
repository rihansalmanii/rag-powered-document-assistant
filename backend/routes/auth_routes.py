from fastapi import APIRouter, Response
from services.auth_service import register_user, login_user, logout_user
from models.user_model import UserCreate, UserLogin

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, response: Response):
    return register_user(user, response)

@router.post("/login")
def login(user: UserLogin, response: Response):
    return login_user(user, response)

@router.post("/logout")
def logout(response: Response):
    return logout_user(response)