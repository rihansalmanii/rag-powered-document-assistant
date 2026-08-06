import os

from bson import ObjectId
from fastapi import HTTPException
from db.mongo import user_collection
from utils.jwt import create_access_token
from utils.security import hash_password, verify_password
from dotenv import load_dotenv

load_dotenv()


IS_PRODUCTION = os.getenv("ENVIRONMENT") == "production"

COOKIE_MAX_AGE = 60 * 60 * 24 * 7


def set_auth_cookie(response, token: str):
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="none" if IS_PRODUCTION else "lax",
        path="/",
        max_age=COOKIE_MAX_AGE,
        expires=COOKIE_MAX_AGE
    )


def delete_auth_cookie(response):
    response.delete_cookie(
        key="token",
        path="/",
        secure=IS_PRODUCTION,
        samesite="none" if IS_PRODUCTION else "lax"
    )


# Register user
def register_user(user, response):
    existing_user = user_collection.find_one({
        "email": user.email
    })

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    hashed_password = hash_password(
        user.password
    )

    result = user_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    })

    token = create_access_token({
        "user_id": str(result.inserted_id)
    })

    set_auth_cookie(
        response=response,
        token=token
    )

    return {
        "success": True,
        "message": "User registered successfully"
    }


# Login user
def login_user(user, response):
    db_user = user_collection.find_one({
        "email": user.email
    })

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="User not found"
        )

    valid_password = verify_password(
        user.password,
        db_user.get("password")
    )

    if not valid_password:
        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )

    token = create_access_token({
        "user_id": str(db_user["_id"])
    })

    set_auth_cookie(
        response=response,
        token=token
    )

    return {
        "success": True,
        "message": "User logged in successfully"
    }


# Logout user
def logout_user(response):
    delete_auth_cookie(response)

    return {
        "success": True,
        "message": "User logged out successfully"
    }


def get_user_by_id(user_id: str):
    user = user_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"]
    }