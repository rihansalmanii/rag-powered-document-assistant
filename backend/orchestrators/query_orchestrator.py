from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

from services.retrieval import retrieve_chunks
from services.generation import generate_answer

from db.mongo import (
    message_collection,
    conversation_collection
)


def handle_query(
    query: str,
    doc_id: str,
    user_id: str,
    conversation_id: str | None = None
):
    try:
        # Validation
        if not query:
            raise HTTPException(status_code=400, detail="query is required")

        if not doc_id:
            raise HTTPException(status_code=400, detail="doc_id is required")

        # Existing conversation
        if conversation_id:
            if not ObjectId.is_valid(conversation_id):
                raise HTTPException(status_code=400, detail="invalid conversation_id")

            conv_obj_id = ObjectId(conversation_id)

            existing = conversation_collection.find_one({
                "_id": conv_obj_id,
                "user_id": user_id,
                "doc_id": doc_id
            })

            if not existing:
                raise HTTPException(status_code=404, detail="conversation not found")

            conversation_id = conv_obj_id

        # New conversation
        else:
            conversation = {
                "user_id": user_id,
                "doc_id": doc_id,
                "title": query[:30],
                "created_at": datetime.utcnow()
            }

            conv = conversation_collection.insert_one(conversation)
            conversation_id = conv.inserted_id

        # Store user message
        message_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "doc_id": doc_id,
            "content": query,
            "role": "user",
            "timestamp": datetime.utcnow()
        })

        # Fetch recent chat history (last 5 messages)
        history_docs = list(
            message_collection.find(
                {"conversation_id": conversation_id}
            ).sort("timestamp", -1).limit(5)
        )

        history = [
            {
                "role": msg["role"],
                "content": msg["content"]
            }
            for msg in reversed(history_docs)
        ]

        # Retrieve chunks
        chunks = retrieve_chunks(
            query=query,
            doc_id=str(doc_id),
        )

        # Handle empty retrieval
        if not chunks:
            answer = "I couldn't find relevant information in the document."
        else:
            answer = generate_answer(
                query=query,
                chunks=chunks,
                history=history  # <-- important upgrade
            )

        # Store assistant response
        message_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "doc_id": doc_id,
            "content": answer,
            "role": "assistant",
            "timestamp": datetime.utcnow()
        })

        # Response
        return {
            "conversation_id": str(conversation_id),
            "answer": answer,
            "chunks": len(chunks),
            "chunks_data": chunks
        }

    except HTTPException:
        # Let FastAPI handle known errors
        raise

    except Exception as e:
        # Unexpected errors
        raise HTTPException(status_code=500, detail=str(e))