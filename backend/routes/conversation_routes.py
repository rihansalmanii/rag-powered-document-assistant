from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter
from db.mongo import message_collection
from creds.credentials import user_id
from db.mongo import conversation_collection

router = APIRouter()

@router.get("/conversations/{conversation_id}")

# get specific conversation
def get_conversation(conversation_id: str):
    try:
        try:
            # handle invalid conversation_id from frontend
            conv_id = ObjectId(conversation_id)
        except InvalidId:
            return{"error": "invalid conversation_id"}


        messages = list(message_collection.find({
            "conversation_id": conv_id
        }).sort("timestamp", 1))

        for msg in messages:
            msg["_id"] = str(msg["_id"])
            msg["conversation_id"] = str(msg["conversation_id"])

        return {
            "messages": messages
        }

    except Exception as e:
        return {"error": str(e)}


# get all the conversations
@router.get("/conversations")
def get_all_conversations():

    # fetch all the conversations of specific user
    conversations = list(conversation_collection.find(
        {"user_id": user_id}
    ).sort("created_at", -1))



    cleaned = []

    # object_id -> string as we cannot return objecId(JSON)
    for conv in conversations:
        cleaned.append({
            "conversation_id": str(conv["_id"]),
            "title": conv.get("title", "New Chat")
        })
    

    return {
        "conversations": cleaned
    }




