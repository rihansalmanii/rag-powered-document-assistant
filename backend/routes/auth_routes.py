from fastapi import APIRouter, Response, Depends
from services.auth_service import register_user, login_user, logout_user, get_user_by_id
from models.user_model import UserCreate, UserLogin
from utils.dependencies import get_current_user


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

@router.get("/me")
def get_me(user_id: str = Depends(get_current_user)):
    return get_user_by_id(user_id)
