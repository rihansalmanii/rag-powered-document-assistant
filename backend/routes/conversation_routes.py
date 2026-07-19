from fastapi import APIRouter
from creds.credentials import user_id as current_user_id
from orchestrators.chat_orchestrator import (
    handle_get_conversation,
    handle_get_all_conversations
)

router = APIRouter()

@router.get("/conversations/{conversation_id}")

# get specific conversation
async def get_conversation(conversation_id: str):
    return await handle_get_conversation(conversation_id, current_user_id)


@router.get("/conversations")
# get all the conversations
async def get_all_conversations():
    return await handle_get_all_conversations(current_user_id)