from fastapi import APIRouter, UploadFile, File
from orchestrators.upload_orchestrator import handle_upload


router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    result = await handle_upload(file)
    return result

    