from fastapi import APIRouter
from services.retrieval import retrieve_chunks
from services.generation import generate_answer
from db.mongo import chat_collection
from creds.credentials import user_id, doc_id


router = APIRouter()

@router.get("/query")
def get_query(query: str):
    user_id = "test_user"
    doc_id = "doc_1"
    chunks = retrieve_chunks(
        query=query,
        user_id=user_id,
        doc_id=doc_id
    )

    answer = generate_answer(query=query, chunks=chunks)

    # storing chat in db
    chat_collection.insert_one({
        "user_id": user_id,
        "doc_id": doc_id,
        "query": query,
        "response": answer
    })

    return {
        "answer": answer,
        "chunks": chunks
    }