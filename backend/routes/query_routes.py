from orchestrators.query_orchestrator import handle_query
from fastapi import APIRouter
from creds.credentials import user_id
from pydantic import BaseModel


router = APIRouter()

class QueryRequest(BaseModel):
   query: str
   doc_id: str
   conversation_id: str | None = None


@router.post("/query")
def query(request: QueryRequest):
   return handle_query(
       query=request.query,
       doc_id=request.doc_id,
       user_id=user_id,
       conversation_id=request.conversation_id
   )
