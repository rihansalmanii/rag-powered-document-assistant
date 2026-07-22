from bson import ObjectId
from bson.errors import InvalidId
from db.mongo import message_collection
from db.mongo import conversation_collection


async def handle_get_conversation(conversation_id: str, user_id):
    try:
        try:
            # handle invalid conversation_id from frontend
            conv_id = ObjectId(conversation_id)
        except InvalidId:
            return{"error": "invalid conversation_id"}


        messages = list(message_collection.find({
            "conversation_id": conv_id,
            "user_id": user_id
        }).sort("timestamp", 1))

        if not messages:
            return {"error": "conversation not found"}

        for msg in messages:
            msg["_id"] = str(msg["_id"])
            msg["conversation_id"] = str(msg["conversation_id"])

        return {
            "messages": messages
        }

    except Exception as e:
        return {"error": str(e)}



async def handle_get_all_conversations(user_id: str):

    try:
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
    
    except Exception as e:  
        return {"error": str(e)}


# new conversation
# async def handle_new_conversation(user_id: str):
#     try:
        




