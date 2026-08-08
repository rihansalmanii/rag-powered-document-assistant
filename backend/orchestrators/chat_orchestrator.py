from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from db.qdrant import delete_document_vectors
from services.pdf_services import delete_pdf_from_storage

from db.mongo import (
    message_collection,
    conversation_collection,
    pdfs_collection
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


def handle_delete_conversation_by_id(conversation_id: str, user_id: str):
    try:
        try:
            conv_id = ObjectId(conversation_id)
        except InvalidId:
            raise HTTPException(
                status_code=400,
                detail="invalid conversation ID"
            )

        conversation = conversation_collection.find_one({
            "_id": conv_id,
            "user_id": user_id
        })

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="conversation not found"
            )

        # all the pdfs in specific conversation id
        pdfs = list(pdfs_collection.find({
            "conversation_id": conversation_id,
            "user_id": user_id
        }))
    
    

        for pdf in pdfs:
            doc_id = str(pdf["_id"])

            delete_document_vectors(user_id=user_id, doc_id=doc_id)

            storage_bucket = pdf.get("storage_bucket")
            storage_path = pdf.get("storage_path")

            if storage_bucket and storage_path:
                delete_pdf_from_storage(bucket=storage_bucket, storage_path=storage_path)

            # deleting the messages
            message_collection.delete_many({
                "conversation_id": conv_id,
                "user_id": user_id
            })

            # delete pdf metadata
            pdfs_collection.delete_many({
                "conversation_id": conversation_id,
                "user_id": user_id
            })

            # delete the conversation
            conversation_collection.delete_one({
                "_id": conv_id,
                "user_id": user_id
            })

            return {
                "success": True,
                "message": "conversation deleted successfully"
            }
        
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

