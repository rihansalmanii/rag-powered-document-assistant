from datetime import datetime

from bson import ObjectId
from fastapi import HTTPException

from db.mongo import (
    conversation_collection,
    message_collection
)
from services.retrieval import retrieve_chunks
from services.generation import generate_answer


def handle_query(
    query: str,
    doc_id: str,
    user_id: str,
    conversation_id: str | None = None
):
    try:
        query = query.strip()

        if not query:
            raise HTTPException(
                status_code=400,
                detail="Query is required"
            )

        if not doc_id:
            raise HTTPException(
                status_code=400,
                detail="Document ID is required"
            )

        # Conversation ID sent from frontend
        if conversation_id:
            if not ObjectId.is_valid(conversation_id):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid conversation ID"
                )

            conv_obj_id = ObjectId(conversation_id)

            existing = conversation_collection.find_one({
                "_id": conv_obj_id,
                "user_id": user_id
            })

            # The ID was generated before upload/query,
            # but the conversation has not yet been inserted
            if not existing:
                conversation_collection.insert_one({
                    "_id": conv_obj_id,
                    "user_id": user_id,
                    "doc_id": doc_id,
                    "title": query[:30],
                    "created_at": datetime.utcnow()
                })

            # Conversation exists; verify document association
            elif existing.get("doc_id") != doc_id:
                raise HTTPException(
                    status_code=400,
                    detail="This document does not belong to the conversation"
                )

        # No ID sent: create a completely new conversation
        else:
            conv_obj_id = ObjectId()

            conversation_collection.insert_one({
                "_id": conv_obj_id,
                "user_id": user_id,
                "doc_id": doc_id,
                "title": query[:30],
                "created_at": datetime.utcnow()
            })

        # From here onward, always use the ObjectId
        conversation_id = conv_obj_id

        # Store user message
        message_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "doc_id": doc_id,
            "content": query,
            "role": "user",
            "timestamp": datetime.utcnow()
        })

        # Fetch recent history
        history_docs = list(
            message_collection.find({
                "conversation_id": conversation_id,
                "user_id": user_id
            })
            .sort("timestamp", -1)
            .limit(5)
        )

        history = [
            {
                "role": message["role"],
                "content": message["content"]
            }
            for message in reversed(history_docs)
        ]

        # Retrieve relevant chunks
        chunks = retrieve_chunks(
            query=query,
            doc_id=doc_id,
            user_id=user_id,
            top_k=5
        )

        if not chunks:
            answer = (
                "I couldn't find relevant information "
                "in the document."
            )
        else:
            answer = generate_answer(
                query=query,
                chunks=chunks,
                history=history
            )

        # Store assistant message
        message_collection.insert_one({
            "conversation_id": conversation_id,
            "user_id": user_id,
            "doc_id": doc_id,
            "content": answer,
            "role": "assistant",
            "timestamp": datetime.utcnow()
        })

        return {
            "conversation_id": str(conversation_id),
            "answer": answer,
            "chunks": len(chunks),
            "chunks_data": chunks
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )