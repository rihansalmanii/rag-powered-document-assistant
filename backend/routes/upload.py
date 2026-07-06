from fastapi import APIRouter, UploadFile, File
from services.pdf_services import extract_text

router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        text = extract_text(file)

        return {
            "filename": file.filename,
            "text_length": len(text),
            "preview": text[:500]
        }

    except Exception as e:
        return {"error": str(e)}

