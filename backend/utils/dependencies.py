from jose import jwt, JWTError
from fastapi import HTTPException, Request
from dotenv import load_dotenv
from db.mongo import user_collection
from bson import ObjectId


import os

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"


def get_current_user(request: Request):
    token = request.cookies.get("token")

    if not token:
        raise HTTPException(status_code=401, detail="please login first!")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")
        
        user = user_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise HTTPException(status_code=401, detail="user not found")

        return user_id

    except HTTPException:
        raise HTTPException(status_code=401, detail="invalid or expired token")
        


    
    
    