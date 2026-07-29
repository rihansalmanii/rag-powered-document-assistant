from orchestrators.query_orchestrator import handle_query
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from utils.dependencies import get_current_user

router = APIRouter()

class QueryRequest(BaseModel):
   query: str
   doc_id: str
   conversation_id: str | None = None


@router.post("/query")
def query(request: QueryRequest, current_user_id: str = Depends(get_current_user)):
   return handle_query(
       query=request.query,
       doc_id=request.doc_id,
       user_id=current_user_id,
       conversation_id=request.conversation_id
   )
