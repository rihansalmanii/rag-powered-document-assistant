from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, Request
from jose import JWTError, jwt

from db.mongo import user_collection
from utils.jwt import SECRET_KEY, ALGORITHM


def get_current_user(request: Request):
    token = request.cookies.get("token")

    if not token:
        raise HTTPException(
            status_code=401,
            detail="Please login first!"
        )

    # 1. Decode JWT
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except JWTError as error:
        print("JWT ERROR:", str(error))

        raise HTTPException(
            status_code=401,
            detail="JWT verification failed"
        )

    # 2. Get user_id
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Token has no user_id"
        )

    print("JWT USER ID:", user_id)

    # 3. Convert ObjectId
    try:
        user_object_id = ObjectId(user_id)
    except InvalidId:
        print("INVALID OBJECT ID:", user_id)

        raise HTTPException(
            status_code=401,
            detail="Invalid user ID in token"
        )

    # 4. Find user
    user = user_collection.find_one({
        "_id": user_object_id
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user_id