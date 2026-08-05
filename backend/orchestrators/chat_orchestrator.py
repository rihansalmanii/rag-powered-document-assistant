from bson import ObjectId
from bson.errors import InvalidId

from db.mongo import (
    message_collection,
    conversation_collection
)


async def handle_get_conversation(
    conversation_id: str,
    user_id: str
):
    try:
        try:
            conv_id = ObjectId(conversation_id)
        except InvalidId:
            return {
                "error": "Invalid conversation ID"
            }

        # First verify conversation ownership
        conversation = conversation_collection.find_one({
            "_id": conv_id,
            "user_id": user_id
        })

        if not conversation:
            return {
                "error": "Conversation not found"
            }

        # Then fetch messages
        messages = list(
            message_collection.find({
                "conversation_id": conv_id,
                "user_id": user_id
            }).sort("timestamp", 1)
        )

        for message in messages:
            message["_id"] = str(message["_id"])
            message["conversation_id"] = str(
                message["conversation_id"]
            )

        return {
            "conversation_id": str(conversation["_id"]),
            "doc_id": conversation.get("doc_id"),
            "title": conversation.get(
                "title",
                "New Chat"
            ),
            "messages": messages
        }

    except Exception as error:
        return {
            "error": str(error)
        }


async def handle_get_all_conversations(
    user_id: str
):
    try:
        conversations = list(
            conversation_collection.find({
                "user_id": user_id
            }).sort("created_at", -1)
        )

        cleaned = []

        for conversation in conversations:
            cleaned.append({
                "conversation_id": str(
                    conversation["_id"]
                ),
                "title": conversation.get(
                    "title",
                    "New Chat"
                ),
                "doc_id": conversation.get("doc_id")
            })

        return {
            "conversations": cleaned
        }

    except Exception as error:
        return {
            "error": str(error)
        }