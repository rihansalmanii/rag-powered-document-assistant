from fastapi import APIRouter
from services.retrieval import retrieve_chunks

router = APIRouter()

@router.get("/query")
def get_query(query: str):
    user_id = "test_user"
    doc_id = "doc_1"
    result = retrieve_chunks(
        query=query,
        user_id=user_id,
        doc_id=doc_id
    )

    return result