from fastapi import APIRouter, UploadFile, File
from orchestrators.upload_orchestrator import handle_upload


router = APIRouter()

@router.post("/upload")
def upload_pdf(file: UploadFile = File(...)):
    result =  handle_upload(file)
    return result

    