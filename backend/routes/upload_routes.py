from fastapi import APIRouter, UploadFile, File, Depends, Form
from utils.dependencies import get_current_user
from orchestrators.upload_orchestrator import handle_upload


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...),conversation_id: str = Form(...), user_id: str = Depends(get_current_user)):
    result =  await handle_upload(file,conversation_id=conversation_id, user_id=user_id)
    return result

    