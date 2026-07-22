import uuid

from fastapi import APIRouter
from creds.credentials import user_id as current_user_id
from orchestrators.chat_orchestrator import (
    handle_get_conversation,
    handle_get_all_conversations
)

router = APIRouter()

# get specific conversation
@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    return await handle_get_conversation(conversation_id, current_user_id)


# get all the conversations
@router.get("/conversations")
async def get_all_conversations():
    return await handle_get_all_conversations(current_user_id)


# new conversation_id for new conversation
@router.post("/conversations/new_id")
async def new_conversation():
    return {"conversation_id": str(uuid.uuid4())}
