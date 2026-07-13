from bson import ObjectId
from fastapi import APIRouter
from db.mongo import message_collection
from creds.credentials import user_id
from db.mongo import conversation_collection

router = APIRouter()

@router.get("/conversations/{conversation_id}")
def get_conversation(conversation_id):
    try:
        messages = message_collection.find({
            "conversation_id": ObjectId(conversation_id)
        })

        return {
            "message": list(messages)
        }

    except Exception as e:
        return {"error": str(e)}


@router.get("/conversations")
def get_all_conversations():

    # fetch all the conversations of specific user
    conversations = list(conversation_collection.find(
        {"user_id": user_id}
    ).sort("created_at", -1))


    # object_id -> string as we cannot return objecId JSON
    for conv in conversations:
        conv["_id"] = str(conv["_id"])
    

    return {
        "conversations": conversations
    }




