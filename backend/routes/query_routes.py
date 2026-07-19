from orchestrators.query_orchestrator import handle_query
from fastapi import APIRouter
from creds.credentials import user_id, doc_id
from pydantic import BaseModel


router = APIRouter()

class QueryRequest(BaseModel):
   query: str
   conversation_id: str | None = None


@router.post("/query")
async def query(request: QueryRequest):
   return await handle_query(request, user_id, doc_id)
