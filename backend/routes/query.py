from datetime import datetime
from fastapi import APIRouter
from services.retrieval import retrieve_chunks
from services.generation import generate_answer
from db.mongo import message_collection
from creds.credentials import user_id, doc_id
from db.mongo import conversation_collection
from pydantic import BaseModel
from bson import ObjectId


router = APIRouter()

class QueryRequest(BaseModel):
   query: str
   conversation_id: str | None = None


@router.post("/query")
def get_query(request: QueryRequest):

   try:

    query = request.query
    conversation_id = request.conversation_id

    if conversation_id:
       try:
          conversation_id = ObjectId(conversation_id)
       except Exception as e:
          return {"error": "invalid conversation_id"}

       # if conversation_is is not exists -> new conversation
    if not conversation_id:
        conversation = {
            "user_id": user_id,
            "doc_id": doc_id,
            "title": query[:30],
            "created_at": datetime.utcnow()
        }

        conv = conversation_collection.insert_one(conversation)
        conversation_id = conv.inserted_id    


    # retrieving chunks from the db based on query, user_id, doc_id
    chunks = retrieve_chunks(
        query=query,
        user_id=user_id,
        doc_id=doc_id
    )

    answer = generate_answer(query=query, chunks=chunks)

    # storing chat in db
    message_collection.insert_one({
        "conversation_id": conversation_id,
        "user_id": user_id,
        "doc_id": doc_id,
        "content": query,
        "role": "user",
        "timestamp": datetime.utcnow()
    })

    message_collection.insert_one({
        "conversation_id": str(conversation_id),
        "user_id": user_id,
        "doc_id": doc_id,
        "content": answer,
        "role": "assistant",
        "timestamp": datetime.utcnow()
    })

    return {
        "conversation_id": str(conversation_id),
        "answer": answer,
        "chunks": chunks
    }
   
   except Exception as e:
      return {"error": str(e)}

    