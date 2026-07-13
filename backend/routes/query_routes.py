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

    if conversation_id is not None:
       try:
          conversation_id = ObjectId(conversation_id)
       except:
          return {"error": "invalid conversation_id"}
       
       existing = conversation_collection.find_one({
                "_id": conversation_id,
                "user_id": user_id
            })

        
       if not existing:
            return {"error": "conversation not found"}

       # if conversation_is is not exists -> new conversation
    else:
        conversation = {
            "user_id": user_id,
            "doc_id": doc_id,
            "title": query[:30],
            "created_at": datetime.utcnow()
        }

        conv = conversation_collection.insert_one(conversation)
        conversation_id = conv.inserted_id    


    # storing chat in db
    message_collection.insert_one({
        "conversation_id": conversation_id,
        "user_id": user_id,
        "doc_id": doc_id,
        "content": query,
        "role": "user",
        "timestamp": datetime.utcnow()
    })


    # retrieving chunks from the db based on query, user_id, doc_id
    chunks = retrieve_chunks(
        query=query,
        user_id=user_id,
        doc_id=doc_id
    )

    # history for next response
    history = list(message_collection.find({
            "conversation_id": conversation_id
        }).sort("timestamp", -1).limit(10))


    # generating response with history
    answer = generate_answer(query=query, chunks=chunks, history=history)

    
    # storing the response in db
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
        "chunks": len(chunks)
    }
   
   except Exception as e:
      return {"error": str(e)}

    