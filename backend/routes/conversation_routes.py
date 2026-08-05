from bson import ObjectId
from fastapi import APIRouter, Depends

from utils.dependencies import get_current_user
from orchestrators.chat_orchestrator import (
    handle_get_conversation,
    handle_get_all_conversations
)

router = APIRouter()


@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user)
):
    return await handle_get_conversation(
        conversation_id,
        user_id
    )


@router.get("/conversations")
async def get_all_conversations(
    user_id: str = Depends(get_current_user)
):
    return await handle_get_all_conversations(
        user_id
    )


@router.post("/conversations/new_id")
async def new_conversation(
    user_id: str = Depends(get_current_user)
):
    return {
        "conversation_id": str(ObjectId())
    }