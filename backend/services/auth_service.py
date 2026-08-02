from db.mongo import user_collection
from fastapi import HTTPException
from utils.security import hash_password
from utils.jwt import create_access_token
from utils.security import verify_password
from bson import ObjectId


# register user
def register_user(user, response):

    # existing user
    existing_user = user_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")


    # hash password
    hashed_password = hash_password(user.password)

    # store user in db
    result = user_collection.insert_one({
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    })

    # create token
    token = create_access_token({"user_id": str(result.inserted_id)})

    # set cookie
    response.set_cookie(key="token", value=token, httponly=True, secure=False)

    return {
        "success": True,
        "message": "User registered successfully",
    }


# login user
def login_user(user, response):

    # find user
    db_user = user_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    # verify password
    valid_password = verify_password(user.password, db_user.get("password"))
    if not valid_password:
        raise HTTPException(status_code=400, detail="Incorrect password")
    
    # create token
    token = create_access_token({"user_id": str(db_user["_id"])})

    response.set_cookie(key="token", value=token, httponly=True, secure=False, path="/", samesite="lax")

    return {
        "success": True,
        "message": "User logged in successfully",
    }


# logout
def logout_user(response):
    response.delete_cookie(key="token", path="/")

    return {
        "status": True,
        "message": "user logged out successfully"
    }

def get_user_by_id(user_id: str):
    user = user_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    return {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "username": user["username"] 
    }