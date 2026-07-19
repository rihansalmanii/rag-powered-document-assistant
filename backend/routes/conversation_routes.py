from bson import ObjectId
from bson.errors import InvalidId
from fastapi import APIRouter
from creds.credentials import user_id
from orchestrators.chat_orchestrator import handle_chat

router = APIRouter()

@router.get("/conversations/{conversation_id}")

# get specific conversation
async def get_conversation(conversation_id: str, user_id, doc_id):
    return await handle_chat(conversation_id, user_id, doc_id)