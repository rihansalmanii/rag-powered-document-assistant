import uuid
from utils.dependencies import get_current_user
from fastapi import APIRouter, Depends
from orchestrators.chat_orchestrator import (
    handle_get_conversation,
    handle_get_all_conversations
)


router = APIRouter()

# get specific conversation
@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str, user_id: str = Depends(get_current_user)):
    return await handle_get_conversation(conversation_id, user_id)


# get all the conversations
@router.get("/conversations")
async def get_all_conversations(user_id: str = Depends(get_current_user)):
    return await handle_get_all_conversations(user_id)


# new conversation_id for new conversation
@router.post("/conversations/new_id")
async def new_conversation():
    return {"conversation_id": str(uuid.uuid4())}
